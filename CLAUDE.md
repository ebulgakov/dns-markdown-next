# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js (App Router) frontend for an unofficial site that lets users browse discounted ("markdown") products from the DNS electronics retailer. It is a BFF (backend-for-frontend): all product/pricelist/analysis data comes from a separate external API (`API_URL`), and this app itself is not the system of record. Auth is via Clerk; guests (unauthenticated users) get equivalent functionality backed by Upstash Redis instead of the external API's user endpoints.

## CodeGraph

In repositories with a healthy CodeGraph index, reach for it BEFORE grep/find or reading files when you need to understand or locate code. Check with `codegraph status` — the `.codegraph/` directory alone isn't proof of an index: only `.codegraph/.gitignore` is tracked in git (see below), so the directory exists on every checkout even before this machine has run the daemon and built a database.

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If `codegraph status` reports no index (or the command itself is unavailable), skip CodeGraph entirely — indexing is the user's decision.

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml`, `pnpm-lock.yaml`). Node version is pinned in `.nvmrc`.

```bash
pnpm dev                 # start dev server (localhost:3000)
pnpm build               # production build
pnpm start               # start production server

pnpm lint                # eslint
pnpm lint:fix            # eslint --fix
pnpm type-check          # tsc --noEmit

pnpm test                # vitest run --project unit (TZ=UTC)
pnpm test:watch          # vitest --project unit, watch mode
pnpm test:coverage       # vitest --project unit --coverage

pnpm storybook           # storybook dev on :6006
pnpm build-storybook     # static storybook build

pnpm dep-check           # dependency-cruiser: circular imports, unresolvable paths
pnpm dep-graph           # dependency-cruiser: mermaid dependency graph
pnpm dep-graph:archi     # dependency-cruiser: svg architecture diagram (needs graphviz `dot`)
```

Run a single unit test file: `TZ=UTC vitest run --project unit path/to/file.test.ts`.

Playwright e2e tests live in `playwright/` (config in `playwright.config.ts`). They build+start the app and run against `http://localhost:3000`: `npx playwright test`. These require Clerk test credentials and Upstash Redis env vars (see CI workflow `.github/workflows/playwright.yml`) — they are not expected to run without that setup.

Unit tests (`vitest`) use the `unit` project defined in `vitest.config.ts`: jsdom environment, files matched by `**/*.test.{ts,tsx}`, colocated with source under `__tests__/` directories (e.g. `src/shared/lib/__tests__/format.test.ts`). A second `storybook` project runs Storybook interaction tests in a real browser (Playwright provider) — this is exercised via `pnpm build-storybook`/Chromatic CI, not `pnpm test`.

CI runs ESLint, `tsc --noEmit` ("TSLint" workflow), Vitest, Playwright, and `pnpm dep-check` (`.github/workflows/dependency-check.yml`) as separate GitHub Actions workflows on push/PR to `main`. Chromatic runs only when a PR is labeled `chromatic`.

## Environment

Copy `.env-example` to `.env` and fill in values. Key variables:
- `API_URL` / `API_SECRET_KEY` — external backend that owns pricelist/product/analysis data (called via `src/shared/api/client.ts`'s `apiClient`, an axios instance sending `X-Internal-API-Secret`).
- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `NEXT_PUBLIC_CLERK_*_URL` — Clerk auth.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — guest user state storage.
- `DEFAULT_CITY` — fallback city (e.g. `samara`) used when a user/guest has none set.
- `WEBHOOK_SECRET_KEY` — bearer secret required by `app/api/revalidate/route.ts` to trigger cache revalidation from the external backend.

## Architecture

The codebase follows Feature-Sliced Design (FSD) under `src/` (`shared → entities → features → widgets`), enforced by `eslint-plugin-boundaries` in `eslint.config.mjs`: `app`/`widget`/`feature`/`entity` are declared as elements (the latter three captured per slice), and a single `boundaries/dependencies` policy set (default: disallow) requires every cross-slice import to go through the target slice's public `index.ts` (`fileInternalPath: "index.ts"`). `shared` also has a forced entry point, but a segment-level one rather than one top-level barrel: `shared/{lib,api,providers}/index.ts` (single barrel per segment) and `shared/ui/<component>/index.ts` (per-component — deliberately no single `shared/ui/index.ts`, because that was tried and broke `next build` by pulling every UI component, including recharts/Radix-heavy ones, into one eagerly-evaluated module graph). Documented single-direction exceptions exist for `entities/product ⇄ entities/user` (asymmetric: product needs exactly one function from user, user needs product's `Goods`/`Favorite` types) and for two entities → features cases (`product-card-compare-button`, `product-card-favorite-toggle`) that a higher-layer slot/IoC refactor isn't worth at this project's scale — see `eslint.config.mjs`'s inline comments for the exact policies. Next's own `app/` directory stays at the project root and is routing-only: `page.tsx`/`layout.tsx`/`app/api/*/route.ts` are intentionally out of scope for FSD restructuring — they compose the `src/` layers but are not moved into them. Route-local UI with a single consumer (e.g. `app/analysis/analytics-*.tsx`, `app/profile/profile-sections.tsx`) is colocated directly next to its `page.tsx` rather than promoted to a shared layer.

### Data layer: user vs. guest, always behind `src/entities/user`'s `post.ts`

Almost all mutating/user-scoped reads go through `src/entities/user/api/post.ts` (re-exported via `src/entities/user/index.ts`), which branches on whether a Clerk session exists (`getSessionInfo()` from `src/entities/user/api/user.ts`, memoized per-request via React's `cache()`):
- **Logged-in** → delegates to `api/user.ts`, which calls the external API with the Clerk bearer token and calls `revalidateTag(`user-${userId}`)` after every mutation.
- **Guest** → delegates to `api/guest.ts`, which reads/writes a `User` object in Upstash Redis keyed by a `guestId` cookie (30-day TTL), with no external API involvement.

Both paths converge on the same shape (`User`, `Favorite`, `SectionsResponse`, etc. from `src/entities/user/model/user.ts`), so components/pages consuming `getUser()` etc. don't need to know which backend served the request. When adding a new user-scoped action, add matching functions to both `api/user.ts` and `api/guest.ts`, then branch on `userId` in `api/post.ts` — don't special-case guest/user logic in components. `api/user.ts`/`api/guest.ts` are private internals of the slice; only `post.ts`'s exports (and `getSessionInfo`/`getUser` from `api/user.ts`, used directly by `app/layout.tsx`, `app/favorites/page.tsx`, `app/profile/page.tsx`) are re-exported through the slice's public `index.ts`.

### Data layer: catalog/analysis reads via `src/entities/product`'s `get.ts`

Read-only catalog/analysis data (pricelists, products, diffs, LLM reports) goes through `src/entities/product/api/get.ts`, where every fetch is wrapped in `unstable_cache` with a `daily-data` (or `llm-report`) tag. `app/api/revalidate/route.ts` is the webhook the external backend calls (with `WEBHOOK_SECRET_KEY`) to bust these tags when new data lands — this is how the app picks up new pricelists without redeploying.

### Route structure

`app/` follows Next.js App Router conventions with route groups: `(home)`, plus `catalog` (with `catalog/markdown/[id]` for a single product), `analysis`, `archive/[id]`, `favorites`, `profile`, `about`, `today`, `sign-in`/`sign-up`. API route handlers live under `app/api/*/route.ts` and are thin wrappers that call into `src/entities/{user,product}`'s public APIs and shape the HTTP response — business/caching logic belongs in `src/entities/`, not in route handlers.

`proxy.ts` is the Clerk middleware entry point (protects `/profile(.*)`; note this project uses `proxy.ts` rather than the conventional `middleware.ts` filename).

### State

- `src/entities/user/model/user-context.tsx` — server-populated user data (favorites, hidden/favorite sections, city) is fetched once in `app/layout.tsx` and provided via React context, avoiding a client-side refetch on every page.
- Zustand stores live with the layer/slice that owns them, not in one shared folder: `src/entities/product/model/pricelist-store.ts` (genuine domain data, read by multiple routes/features — hence `entities`, not a feature); `src/features/search/model/search-store.ts`, `src/features/sort-goods/model/sort-goods-store.ts`, `src/features/llm-report/model/llm-store.ts` (feature-owned UI/interaction state, consumed cross-feature only through that feature's public `index.ts`).
- `src/shared/providers/` — `QueryProvider` (TanStack Query) and `ThemeProvider` (next-themes) wrap the tree in `app/layout.tsx`. Pure infra wrappers, no business logic, hence `shared` rather than app-shell code.
- `src/widgets/{navbar,footer}/` — app-shell chrome rendered once from `app/layout.tsx` (navbar includes the folded-in `logo`).

### UI conventions

- shadcn/ui ("new-york" style) is configured in `components.json`; primitives live in `src/shared/ui`, with path aliases `@/shared/*`, `@/entities/{user,product}`, `@/features/{product-catalog,search,sort-goods,jump-to-section,llm-report,change-city}`, `@/widgets/{navbar,footer}`, plus the catch-all `@/*` for anything not yet under `src/` (notably all of `app/`, `types/`) — use these aliases, don't add new ones.
- i18n via `next-intl`; translation strings live in `i18n/locates/{en,ru}.json`, loaded through `i18n/request.ts`. Russian (`ru`) is the primary/default locale (see README).
- Storybook stories are colocated with components (`*.stories.tsx`), both under `src/**` and route-local under `app/**`; Chromatic is wired for visual regression but only runs in CI when a PR carries the `chromatic` label.
- Sentry (`@sentry/nextjs`) is wired via `next.config.ts` (`withSentryConfig`) and `sentry.server.config.ts`/`sentry.edge.config.ts`/`instrumentation*.ts`.

### Import ordering & formatting

ESLint enforces `import/order` (builtin → external → internal → parent → sibling → index → object → type, alphabetized, blank line between groups) — see `eslint.config.mjs`. Prettier config (`.prettierrc`): no trailing commas, double quotes, no semicolon-omission changes needed (semi: true), `arrowParens: avoid`, tailwind class sorting via `prettier-plugin-tailwindcss`. Run `pnpm lint:fix` after edits touching imports.

## Code style

- No `any` (`@typescript-eslint/no-explicit-any`, `eslint.config.mjs`) — if you're reaching for `any`, the real fix is usually a proper type or a narrower `unknown`.
- No unjustified `eslint-disable`. Zero exist in the repo today — a new one needs a genuine conflict between two tools/rules, stated inline, not "the linter was annoying here."
- `max-lines-per-function` is enforced at 80, and `max-lines` (whole file) at 250, both `skipBlankLines`/`skipComments`, both across `.ts` and `.tsx` (`eslint.config.mjs`). `__tests__/` files are exempt from both (arrange-act-assert blocks legitimately run long); both also exempt `*.stories.tsx`. Eleven files are grandfathered by filename for `max-lines-per-function` (mostly React components — a JSX-heavy render body trips this rule at a much lower true "logic" size than a `.ts` file would); `src/shared/ui/chart/chart.tsx` (shadcn-generated) is additionally grandfathered for `max-lines`. That list should only shrink (refactor one below its threshold, drop the entry), never grow — see `eslint.config.mjs` for the exact file list.
- **FSD layer boundaries** are enforced by `eslint-plugin-boundaries` — see Architecture above for the full policy graph. `**/*.stories.tsx`, `**/__mocks__/**`, and `**/__tests__/**` are exempt from the `boundaries/dependencies` check entirely (`eslint.config.mjs`'s boundaries block `ignores`): those files legitimately reach into internals (mocking a store, rendering a component directly) that production code must not.
- `dependency-cruiser` (`.dependency-cruiser.cjs`, `pnpm dep-check`, see Commands) covers what `eslint-plugin-boundaries` structurally can't: circular imports anywhere in `app/**`/`src/**`, and unresolvable import paths (a canary against a misconfigured resolver silently passing `no-circular` while checking nothing).

## Subagents

Subagent roster and routing are defined in AGENTS.md (single source of truth for Claude Code and other CLIs): @AGENTS.md
