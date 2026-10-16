# packages/env — `@dns-markdown/env`

Shared env helpers for all apps. Monorepo-wide env-file rules are in the root `CLAUDE.md`.

## API (`src/index.ts`)

- `loadEnv()` — finds the monorepo root (closest parent dir with `bun.lock`, resolved from this file, not cwd — works from sources and from a bundled `dist/`) and loads `.env.<NODE_ENV>` then `.env` from it. Missing files are skipped silently. Call it once at the top of an app's env module, before validating.
- `isProd()` / `isDev()` / `isTestEnv()` — `NODE_ENV` checks. Unset `NODE_ENV` makes all of them `false` (so e.g. error `details` are never exposed by accident).
- `isVercel()` — running on Vercel (`VERCEL` var set by the platform).

## Rules

- **Only loading and checks, no validation.** Each app owns its zod schema; do not add app-specific variables here.
- **Read env vars via destructuring** (`const { NODE_ENV } = process.env`), never `process.env.NODE_ENV`: `bun build` inlines a literal `process.env.NODE_ENV` at build time (`"development"` without `--production`), which would freeze the mode into the bundle.
