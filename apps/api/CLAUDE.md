# apps/api — `@dns-markdown/api`

Express 5 API, deployed to Vercel (Vercel project Root Directory = `apps/api`). Paths below are relative to `apps/api`. Monorepo-wide rules (commands, env files, code style) are in the root `CLAUDE.md`.

## Commands

Run inside `apps/api`, or from the root via `bunx nx run @dns-markdown/api:<script>`:

```bash
bun run dev                 # NODE_ENV=development, watch
bun run dev:test            # NODE_ENV=test, watch
bun run dev:prod            # NODE_ENV=production, watch — production keys, hits real prod services
bun run build               # bundle to dist/index.js (bun build, targets node)
bun run start               # built bundle, no NODE_ENV
bun run start:prod          # built bundle, NODE_ENV=production (run build first)
bun test                    # all api tests
bun test path/to/file.test.ts   # single test file
bun test --watch
bun run generate:openapi    # regenerate openapi.json (CI fails if it is stale)
```

Tests are colocated in `__tests__` (or `__test__`) directories next to the code they cover, using `bun:test` (not Jest/Vitest) with `mock`/`mock.module` for mocking. Env vars required by `src/env.ts` must be present for tests to run — see `.github/workflows/test.yml` for the full list of vars and their dummy CI values.

## Env

`src/env.ts` calls `loadEnv()` from `@dns-markdown/env`, then validates `process.env` with the api's zod schema and exports `env`. Nothing in the api reads `process.env` directly outside of that file; for mode checks use `isDev`/`isTestEnv`/`isProd`/`isVercel` from `@dns-markdown/env`.

## Architecture

Express 5 app (`src/server.ts`) exported as default and started conditionally in `src/index.ts`: it calls `app.listen` everywhere except on Vercel (`isVercel()`), since there Vercel runs the bundled `dist/index.js` as a single serverless function; so `start:prod` can run the production bundle locally. `vercel.json` pins `outputDirectory: "dist"` so the bundle is the entrypoint — without it Vercel runs unbundled `src/` and crashes with `ERR_UNSUPPORTED_DIR_IMPORT`. Do not add `rewrites` there: they change the path Express sees.

### Route layout

Each route group is its own directory under `src/` with an `index.ts` that builds an Express `Router` and wires one file per handler (one handler per file is the convention — see `src/pricelist-routes`, `src/products-routes`, `src/analysis-routes`, `src/user-routes`, `src/service-routes`, `src/llm-routes`, `src/clerk-routes`). Route-specific helpers live in a `helpers/` subfolder next to the handlers that use them.

Mounting order and auth layering happens in `src/server.ts`:

- `/health` — no auth.
- `/api/*` — double-gated: `clerkMiddleware()` (Clerk session) then `authPublicMiddleware` (requires `X-Internal-API-Secret` header matching `API_SECRET_KEY`). Mounted under this: `pricelist`, `products`, `analysis`, `llm`, `user`.
- `/clerk/*` — Clerk webhooks (signature-verified via `svix`, not the two middlewares above). Note `/clerk/create-user` needs `express.raw()` body parsing (mounted _before_ the global `express.json()` — order matters) so the webhook signature can be verified against the raw body.
- `/service/*` — internal/background-job routes, gated by `authServiceMiddleware` (`Authorization: Bearer <API_SERVICE_KEY>`), used for cross-service writes (inserting price lists, analysis data/diffs, notification fan-out, cache invalidation) rather than public reads.
- `ensureDbConnectionMiddleware` (`src/middleware/db-connection-middleware.ts`) runs globally before routes and lazily opens the Mongoose connection via `dbConnect(env.DATABASE_URL)` from `@dns-markdown/db/database`.
- A final Express error-handling middleware returns `{ error: "Internal Server Error" }`, and additionally `details` when `isDev()`. Route handlers should catch and call `next(error)` rather than handling errors themselves.

Full endpoint-by-endpoint request/response contracts are documented in `API.md` (in Russian) — check it before changing route behavior, and update it when adding/changing endpoints.

### Data layer

Models, schemas and payload types come from `@dns-markdown/db` (see `packages/db/CLAUDE.md`), imported by subpath: `@dns-markdown/db/models/pricelist`, `import type ... from "@dns-markdown/db/types/pricelist"`. `src/types/*` keeps only API-local ambient declarations. Tests mock models by the package subpath, e.g. `mock.module("@dns-markdown/db/models/pricelist", ...)` — mocking any other specifier will not intercept the import.

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

## Imports

Path alias `@src/*` maps to `src/*` (see `tsconfig.json`); prefer it over deep relative imports (`../../..`) for cross-directory imports, but sibling/parent-relative imports are used within a route group's own files (e.g. importing a handler's own `helpers/`).
