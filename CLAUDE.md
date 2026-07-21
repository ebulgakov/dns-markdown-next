# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js (App Router) frontend for an unofficial site that lets users browse discounted ("markdown") products from the DNS electronics retailer. It is a BFF (backend-for-frontend): all product/pricelist/analysis data comes from a separate external API (`API_URL`), and this app itself is not the system of record. Auth is via Clerk; guests (unauthenticated users) get equivalent functionality backed by Upstash Redis instead of the external API's user endpoints.

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
```

Run a single unit test file: `TZ=UTC vitest run --project unit path/to/file.test.ts`.

Playwright e2e tests live in `playwright/` (config in `playwright.config.ts`). They build+start the app and run against `http://localhost:3000`: `npx playwright test`. These require Clerk test credentials and Upstash Redis env vars (see CI workflow `.github/workflows/playwright.yml`) — they are not expected to run without that setup.

Unit tests (`vitest`) use the `unit` project defined in `vitest.config.ts`: jsdom environment, files matched by `**/*.test.{ts,tsx}`, colocated with source under `__tests__/` directories (e.g. `app/helpers/__tests__/format.test.ts`). A second `storybook` project runs Storybook interaction tests in a real browser (Playwright provider) — this is exercised via `pnpm build-storybook`/Chromatic CI, not `pnpm test`.

CI runs ESLint, `tsc --noEmit` ("TSLint" workflow), Vitest, and Playwright as separate GitHub Actions workflows on push/PR to `main`. Chromatic runs only when a PR is labeled `chromatic`.

## Environment

Copy `.env-example` to `.env` and fill in values. Key variables:
- `API_URL` / `API_SECRET_KEY` — external backend that owns pricelist/product/analysis data (called via `services/client.ts`'s `apiClient`, an axios instance sending `X-Internal-API-Secret`).
- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `NEXT_PUBLIC_CLERK_*_URL` — Clerk auth.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — guest user state storage.
- `DEFAULT_CITY` — fallback city (e.g. `samara`) used when a user/guest has none set.
- `WEBHOOK_SECRET_KEY` — bearer secret required by `app/api/revalidate/route.ts` to trigger cache revalidation from the external backend.

## Architecture

### Data layer: user vs. guest, always behind `services/post.ts`

Almost all mutating/user-scoped reads go through `services/post.ts`, which branches on whether a Clerk session exists (`getSessionInfo()` from `services/user.ts`, memoized per-request via React's `cache()`):
- **Logged-in** → delegates to `services/user.ts`, which calls the external API with the Clerk bearer token and calls `revalidateTag(`user-${userId}`)` after every mutation.
- **Guest** → delegates to `services/guest.ts`, which reads/writes a `User` object in Upstash Redis keyed by a `guestId` cookie (30-day TTL), with no external API involvement.

Both paths converge on the same shape (`User`, `Favorite`, `SectionsResponse`, etc. from `types/user.ts`), so components/pages consuming `getUser()` etc. don't need to know which backend served the request. When adding a new user-scoped action, add matching functions to both `services/user.ts` and `services/guest.ts`, then branch on `userId` in `services/post.ts` — don't special-case guest/user logic in components.

### Data layer: catalog/analysis reads via `services/get.ts`

Read-only catalog/analysis data (pricelists, products, diffs, LLM reports) goes through `services/get.ts`, where every fetch is wrapped in `unstable_cache` with a `daily-data` (or `llm-report`) tag. `app/api/revalidate/route.ts` is the webhook the external backend calls (with `WEBHOOK_SECRET_KEY`) to bust these tags when new data lands — this is how the app picks up new pricelists without redeploying.

### Route structure

`app/` follows Next.js App Router conventions with route groups: `(home)`, plus `catalog` (with `catalog/markdown/[id]` for a single product), `analysis`, `archive/[id]`, `favorites`, `profile`, `about`, `today`, `sign-in`/`sign-up`. API route handlers live under `app/api/*/route.ts` and are thin wrappers that call `services/get.ts`/`services/post.ts` and shape the HTTP response — business/caching logic belongs in `services/`, not in route handlers.

`proxy.ts` is the Clerk middleware entry point (protects `/profile(.*)`; note this project uses `proxy.ts` rather than the conventional `middleware.ts` filename).

### State

- `app/contexts/user-context.tsx` — server-populated user data (favorites, hidden/favorite sections, city) is fetched once in `app/layout.tsx` and provided via React context, avoiding a client-side refetch on every page.
- `app/stores/*` (zustand) — client-only UI state: search, sort-goods, llm, pricelist stores.
- `app/providers/` — `QueryProvider` (TanStack Query) and `ThemeProvider` (next-themes) wrap the tree in `app/layout.tsx`.

### UI conventions

- shadcn/ui ("new-york" style) is configured in `components.json`; primitives live in `app/components/ui`, with path aliases `@/app/components`, `@/app/lib`, `@/app/hooks` etc. — use these aliases, don't add new ones.
- i18n via `next-intl`; translation strings live in `i18n/locates/{en,ru}.json`, loaded through `i18n/request.ts`. Russian (`ru`) is the primary/default locale (see README).
- Storybook stories are colocated with components (`*.stories.tsx`); Chromatic is wired for visual regression but only runs in CI when a PR carries the `chromatic` label.
- Sentry (`@sentry/nextjs`) is wired via `next.config.ts` (`withSentryConfig`) and `sentry.server.config.ts`/`sentry.edge.config.ts`/`instrumentation*.ts`.

### Import ordering & formatting

ESLint enforces `import/order` (builtin → external → internal → parent → sibling → index → object → type, alphabetized, blank line between groups) — see `eslint.config.mjs`. Prettier config (`.prettierrc`): no trailing commas, double quotes, no semicolon-omission changes needed (semi: true), `arrowParens: avoid`, tailwind class sorting via `prettier-plugin-tailwindcss`. Run `pnpm lint:fix` after edits touching imports.
