# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Bun workspaces (`apps/*`, `packages/*`) orchestrated by **Nx** (package-based: targets are inferred from each workspace's `package.json` scripts, no Nx plugins; caching rules live in `nx.json`). Single `bun.lock` at the root; `bunfig.toml` pins `linker = "hoisted"` so Vercel can trace external modules from the root `node_modules`. Shared compiler options live in `tsconfig.base.json`; every workspace `tsconfig.json` extends it (the root `tsconfig.json` covers only root-level config files like `eslint.config.ts`).

Each workspace has its own `CLAUDE.md` with details — read it before working in that workspace:

- `apps/api` (`@dns-markdown/api`) — the Express API, deployed to Vercel. See `apps/api/CLAUDE.md`.
- `packages/db` (`@dns-markdown/db`) — Mongoose models, schemas, payload types and `dbConnect(uri)`. See `packages/db/CLAUDE.md`.
- `packages/env` (`@dns-markdown/env`) — shared env-file loading and `NODE_ENV`/platform checks. See `packages/env/CLAUDE.md`.

`dns-markdown-parser-next` will later move into `apps/` as another workspace.

## Commands

This project uses **Bun** (not npm/node) as the package manager and runtime. Run from the repo root:

```bash
bun install                 # install all workspaces
bun run dev                 # api dev server with watch mode
bun run test                # nx run-many -t test (not cached: env files are not part of the cache key)
bun run lint                # nx run-many -t lint
bun run lint:fix            # eslint --fix across the repo
bun run type-check          # nx run-many -t type-check
bun run build               # nx run-many -t build
bun run affected            # lint/type-check/test/build only for projects changed vs main
bunx nx run <project>:<script>   # any single script of one project, e.g. @dns-markdown/api:dev:prod
```

Nx runs every target with cwd = the project root. Use `bun run test` (Nx), not a bare `bun test` from the root.

## Env files

Env files are shared by all workspaces and live in the **monorepo root**: `.env.<NODE_ENV>` (`.env.development`, `.env.test`, `.env.production`) is loaded first, then the common `.env` (already set vars are never overridden). Loading is done by `loadEnv()` from `@dns-markdown/env`; each app validates only its own variables with its own zod schema. In production there are no env files — the platform (Vercel, later Fly) injects vars. Never read `process.env` directly outside an app's env module or `packages/env`.

## Code style

Enforced by the root `eslint.config.ts` and `.prettierrc` for all workspaces: no semicolon-trailing commas, double quotes, 100-char print width, arrow function params unparenthesized when single-arg. Import order is enforced (builtin → external → internal → parent → sibling → index → type) with alphabetization and mandatory blank lines between groups — let `bun run lint:fix` handle this rather than ordering imports by hand.

Cross-workspace imports go through the workspace package name (`@dns-markdown/db/...`, `@dns-markdown/env`), never through relative paths into another workspace.
