# packages/db — `@dns-markdown/db`

Shared Mongoose data layer: models, schemas, payload types and the connection helper. Used by `apps/api`; meant to be reused by the parser once it moves into the monorepo. Monorepo-wide rules are in the root `CLAUDE.md`.

## Package shape

Internal package without a build step: `exports` in `package.json` point straight at `.ts` sources, and consumers import by subpath:

- `@dns-markdown/db/models/<name>` — Mongoose models (`src/models/*`)
- `@dns-markdown/db/schemas/<name>` — schemas (`src/schemas/*`)
- `@dns-markdown/db/types/<name>` — hand-written TS payload types (`src/types/*`), imported with `import type`
- `@dns-markdown/db/database` — `dbConnect(uri)` / `dbDisconnect()`

There is no root `index.ts` on purpose: subpath imports keep `mock.module("@dns-markdown/db/models/<name>", ...)` in consumers' tests granular. When adding a new file under `models/`, `schemas/` or `types/`, it is exported automatically by the wildcard; a new top-level module needs a new `exports` entry.

## Rules

- **No env access.** The package must not read `process.env` or import any app's env module — callers pass config in (e.g. `dbConnect(env.DATABASE_URL)`), so the package works the same under Vercel, Fly, local runs and tests.
- Inside the package use relative imports (`../types/pricelist`), not the package name and not `@src/*`.
- Each model is backed by a schema in its own file so schemas can be composed/reused (e.g. the `pricelist`, `user` and `analysis-data` schemas embed the `goods` schema). Models use the `mongoose.models.X || mongoose.model(...)` guard to survive hot reloads and serverless re-imports.
- `dbConnect` caches the connection on `global.mongoose` (declared in `src/database.ts`), so repeated invocations (e.g. serverless cold starts) reuse it.
