# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Bun workspaces (`apps/*`, `packages/*`) orchestrated by **Nx** (package-based: targets are inferred from each workspace's `package.json` scripts, no Nx plugins; caching/`dependsOn` live in `nx.json`). Single `bun.lock` at the root; `bunfig.toml` pins `linker = "hoisted"` so Vercel can trace external modules from the root `node_modules`.

- `apps/api` (`@dns-markdown/api`) — the Express API, deployed to Vercel (Vercel project Root Directory = `apps/api`).
- `packages/db` (`@dns-markdown/db`) — Mongoose models, schemas, payload types and `dbConnect(uri)`. Internal package: `exports` point straight at `.ts` sources (no build step), imported via subpaths like `@dns-markdown/db/models/pricelist`, `@dns-markdown/db/types/pricelist`, `@dns-markdown/db/database`. It must not read `process.env` — callers pass config in.
- `packages/env` (`@dns-markdown/env`) — `loadEnv()` (loads the shared env files from the monorepo root) and `isProd`/`isDev`/`isTestEnv`. Only loading and mode checks — each app keeps its own zod schema for validation. Mode helpers read `NODE_ENV` via destructuring: `bun build` inlines a literal `process.env.NODE_ENV` at build time.

`dns-markdown-parser-next` will later move into `apps/` as another workspace.

Unless stated otherwise, `src/...` paths below are relative to `apps/api`.

## Commands

This project uses **Bun** (not npm/node) as the package manager and runtime. Run from the repo root:

```bash
bun install                 # install all workspaces
bun run dev                 # api dev server with watch mode (apps/api/src/index.ts)
bun run test                # nx run-many -t test
bun run lint                # nx run-many -t lint
bun run lint:fix            # eslint --fix across the repo
bun run type-check          # nx run-many -t type-check
bun run build               # nx run-many -t build (api -> apps/api/dist/index.js)
bun run affected            # lint/type-check/test/build only for projects changed vs main
bunx nx run @dns-markdown/api:<script>   # any single script of one project
```

Inside `apps/api` the per-project commands still work (`bun test path/to/file.test.ts`, `bun test --watch`, `bun run start`, `bun run generate:openapi`). Nx runs every target with cwd = the project root.

Tests are colocated in `__tests__` (or `__test__`) directories next to the code they cover, using `bun:test` (not Jest/Vitest) with `mock`/`mock.module` for mocking. Env vars required by `src/env.ts` must be present for tests to run — see `.github/workflows/test.yml` for the full list of vars and their dummy CI values.

Env files are shared by all workspaces and live in the **monorepo root**; `src/env.ts` loads them via `loadEnv()` from `@dns-markdown/env` (root found by walking up to `bun.lock`, so it works from `src/` and the bundled `dist/` regardless of cwd): first `.env.<NODE_ENV>` (`development` → `.env.development`, `test` → `.env.test`, `production` → `.env.production`), then the common `.env` (dotenv never overrides already set vars). Each app validates only its own variables with its own zod schema — for the api that is `src/env.ts`. In production there are no env files: Vercel injects vars from the project settings. Nothing should read `process.env` directly outside of that file.

## Architecture

Express 5 app (`src/server.ts`) exported as default and started conditionally in `src/index.ts` (only calls `app.listen` outside of `production`, since in production Vercel runs the bundled `dist/index.js` as a single serverless function. `vercel.json` pins `outputDirectory: "dist"` so the bundle is the entrypoint — without it Vercel runs unbundled `src/` and crashes with `ERR_UNSUPPORTED_DIR_IMPORT`. Do not add `rewrites` there: they change the path Express sees).

### Route layout

Each route group is its own directory under `src/` with an `index.ts` that builds an Express `Router` and wires one file per handler (one handler per file is the convention — see `src/pricelist-routes`, `src/products-routes`, `src/analysis-routes`, `src/user-routes`, `src/service-routes`, `src/llm-routes`, `src/clerk-routes`). Route-specific helpers live in a `helpers/` subfolder next to the handlers that use them.

Mounting order and auth layering happens in `src/server.ts`:

- `/health` — no auth.
- `/api/*` — double-gated: `clerkMiddleware()` (Clerk session) then `authPublicMiddleware` (requires `X-Internal-API-Secret` header matching `API_SECRET_KEY`). Mounted under this: `pricelist`, `products`, `analysis`, `llm`, `user`.
- `/clerk/*` — Clerk webhooks (signature-verified via `svix`, not the two middlewares above). Note `/clerk/create-user` needs `express.raw()` body parsing (mounted _before_ the global `express.json()` — order matters) so the webhook signature can be verified against the raw body.
- `/service/*` — internal/background-job routes, gated by `authServiceMiddleware` (`Authorization: Bearer <API_SERVICE_KEY>`), used for cross-service writes (inserting price lists, analysis data/diffs, notification fan-out, cache invalidation) rather than public reads.
- `ensureDbConnectionMiddleware` runs globally before routes and lazily opens the Mongoose connection (`packages/db/src/database.ts`, called with `env.DATABASE_URL` from `src/middleware/db-connection-middleware.ts`), caching the connection on `global.mongoose` so repeated invocations (e.g. serverless cold starts) reuse it.
- A final Express error-handling middleware returns `{ error: "Internal Server Error" }`, and additionally `details` when `isDev()` (from `@dns-markdown/env`). Route handlers should catch and call `next(error)` rather than handling errors themselves.

Full endpoint-by-endpoint request/response contracts are documented in `API.md` (in Russian) — check it before changing route behavior, and update it when adding/changing endpoints.

### Data layer

Mongoose models live in `packages/db/src/models/*`, each backed by a schema in `packages/db/src/schemas/*` (kept as separate files so schemas can be composed/reused, e.g. `pricelist.ts` schema embeds the `goods` schema). Corresponding hand-written TS types for the stored/API payloads live in `packages/db/src/types/*` and are imported with `import type` from `@dns-markdown/db/types/*`; `apps/api/src/types/*` keeps only API-local ambient declarations. Tests mock models by the package subpath, e.g. `mock.module("@dns-markdown/db/models/pricelist", ...)`.

### Cache

`src/cache/index.ts` wraps Upstash Redis with a `CACHE_PREFIX`-namespaced key helper (`cacheGet`, `cacheAdd`, `cacheKeys`, `cacheDelete`). Handlers follow a consistent cache-aside pattern: build a deterministic key (e.g. `` `daily:pricelist:last:${city}` ``), try `cacheGet`, fall back to a DB query on miss, then `cacheAdd` the result (commonly with a 24h TTL: `{ ex: 60 * 60 * 24 }`). `/service/clear-cache-by-key` allows glob-pattern invalidation.

### LLM / Vector

`src/llm/index.ts` wraps OpenAI chat completions for three report-generation functions (`compareLLMGoods`, `describeLLMGood`, `generateLLMReport`) — prompts are hardcoded to require Markdown-only output translated to Russian. `src/vector/index.ts` wraps Upstash Vector to fetch product metadata by id (used to hydrate product links passed into the LLM routes before prompting). LLM route handlers (`src/llm-routes/*`) cache generated reports the same cache-aside way as other routes.

### Auth model

Two independent, non-overlapping auth schemes coexist (`src/middleware/auth-middleware.ts`):

- `authPublicMiddleware` — frontend-facing routes under `/api`, shared-secret header check, layered on top of Clerk session auth.
- `authServiceMiddleware` — machine-to-machine routes under `/service`, bearer-token check.

Do not conflate the two when adding new routes — pick based on whether the caller is the frontend (with a logged-in Clerk user) or another internal service.

### Observability

`src/otel.ts` (OpenTelemetry SDK + auto-instrumentation, exported via OTLP) and `src/instrument.ts` (Sentry) are imported for side effects only, at the very top of `src/index.ts` / `src/server.ts` respectively — order of these imports relative to other imports matters for instrumentation to attach correctly.

## Code style

Enforced by `eslint.config.ts` and `.prettierrc`: no semicolon-trailing commas, double quotes, 100-char print width, arrow function params unparenthesized when single-arg. Import order is enforced (builtin → external → internal → parent → sibling → index → type) with alphabetization and mandatory blank lines between groups — let `bun run lint:fix` handle this rather than ordering imports by hand.

Path alias `@src/*` maps to `src/*` inside `apps/api` (see `apps/api/tsconfig.json`); cross-package imports go through the workspace package name instead; prefer it over deep relative imports (`../../..`) for cross-directory imports, but sibling/parent-relative imports are used within a route group's own files (e.g. importing a handler's own `helpers/`).
