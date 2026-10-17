# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Bun workspaces (`apps/*`, `packages/*`) orchestrated by **Nx** (package-based: targets are inferred from each workspace's `package.json` scripts, no Nx plugins; caching rules live in `nx.json`). Single `bun.lock` at the root; `bunfig.toml` pins `linker = "hoisted"` so Vercel can trace external modules from the root `node_modules`. Shared compiler options live in `tsconfig.base.json`; every workspace `tsconfig.json` extends it (the root `tsconfig.json` covers only root-level config files like `eslint.config.ts`).

Each workspace has its own `CLAUDE.md` with details — read it before working in that workspace:

- `apps/api` (`@dns-markdown/api`) — the Express API, deployed to Vercel. See `apps/api/CLAUDE.md`.
- `apps/web` (`@dns-markdown/web`) — the Next.js (App Router) frontend/BFF, deployed to Vercel; talks to the API over HTTP (`API_URL`). See `apps/web/CLAUDE.md`.
- `apps/parser` (`@dns-markdown/parser`) — DNS markdown scraper/ETL (CLI pipeline); pushes data to the API over HTTP, runs locally only (not deployed). See `apps/parser/CLAUDE.md`.
- `packages/db` (`@dns-markdown/db`) — Mongoose models, schemas and `dbConnect(uri)`. See `packages/db/CLAUDE.md`.
- `packages/env` (`@dns-markdown/env`) — shared env-file loading and `NODE_ENV`/platform checks. See `packages/env/CLAUDE.md`.
- `packages/types` (`@dns-markdown/types`) — shared API payload/response types (JSON wire shapes, no runtime code). See `packages/types/CLAUDE.md`.
- `packages/api-client` (`@dns-markdown/api-client`) — typed axios client for every `apps/api` endpoint, used by web, parser and the planned Expo app (React Native compatible: no env, no Next). See `packages/api-client/CLAUDE.md`.

## Commands

This project uses **Bun** (not npm/node) as the package manager and runtime. Run from the repo root:

```bash
bun install                 # install all workspaces
bun run dev                 # dev targets of all projects (api watch mode, web on :3000)
bun run test                # nx run-many -t test (not cached: env files are not part of the cache key)
bun run lint                # nx run-many -t lint
bun run lint:fix            # eslint --fix across the repo (root config + apps/web's own config)
bun run type-check          # nx run-many -t type-check
bun run build               # nx run-many -t build
bun run affected            # lint/type-check/test/build only for projects changed vs main
bunx nx run <project>:<script>   # any single script of one project, e.g. @dns-markdown/api:dev:prod
```

Nx runs every target with cwd = the project root. Root scripts set `NX_LOAD_DOT_ENV_FILES=false`: otherwise Nx injects the root `.env*` files into every task's environment, which leaks the API's vars (including `NODE_ENV`) into `apps/web` and breaks `next build` — so when calling `bunx nx` directly, prefix it the same way. Prefer `bun run test` (Nx, one process per project). A bare `bun test` from the root also works (runs all workspaces in one process); the parser's test preload is therefore set in both `bunfig.toml` (root) and `apps/parser/bunfig.toml` — keep them in sync.

## Env files

`apps/web` included: Next.js itself only reads `apps/web/.env*`, so `apps/web/next.config.ts` calls `loadEnv()` from `@dns-markdown/env` before Next compiles anything — server code then reads the vars from `process.env` and `NEXT_PUBLIC_*` get inlined into the client bundle. Do not put env files into `apps/web/`.

Env files are shared by all workspaces and live in the **monorepo root**: `.env.<NODE_ENV>` (`.env.development`, `.env.test`, `.env.production`) is loaded first, then the common `.env` (already set vars are never overridden). Loading is done by `loadEnv()` from `@dns-markdown/env`; each app validates only its own variables with its own zod schema. In production there are no env files — Vercel injects the API's vars (the parser is not deployed). A key both apps share (`API_SECRET_KEY`, `API_SERVICE_KEY`, `UPSTASH_VECTOR_*`) lives once in the shared file; per-app differences go into the app's `package.json` scripts (e.g. the parser's `CITY` / `WRITE_STRATEGY`). Keep `CITY` out of the shared `.env` — parser stages rely on it being set only by their scripts. All keys are listed in the root `.env.example`. Never read `process.env` directly outside an app's env module or `packages/env`.

## Code style

Enforced by the root `eslint.config.ts` and `.prettierrc` for all workspaces except `apps/web`, which has its own `eslint.config.mjs` (Next, FSD boundaries, Storybook rules), `.prettierrc` (Tailwind plugin) and `.lintstagedrc.json`: no semicolon-trailing commas, double quotes, 100-char print width, arrow function params unparenthesized when single-arg. Import order is enforced (builtin → external → internal → parent → sibling → index → type) with alphabetization and mandatory blank lines between groups — let `bun run lint:fix` handle this rather than ordering imports by hand.

Apps except `apps/web` (Next.js / Feature-Sliced Design layout, see its `CLAUDE.md`) share one layout: code in `src/`, kebab-case file and folder names, `@src/*` → `src/*` alias (tsconfig `paths`) for cross-directory imports, relative imports within a folder, no file extensions in imports. Cross-workspace imports go through the workspace package name (`@dns-markdown/db/...`, `@dns-markdown/types/...`, `@dns-markdown/api-client`, `@dns-markdown/env`), never through relative paths into another workspace.

## Subagents

Subagent roster and routing are defined in AGENTS.md (single source of truth for Claude Code and other CLIs): @AGENTS.md

## Worktree policy

Never use `EnterWorktree` in this repo — always work directly in the current branch/checkout. This is enforced by a `PreToolUse` hook (`.claude/hooks/block-worktree.sh`, wired up in `.claude/settings.json`) that denies every `EnterWorktree` call: if it detects only the main checkout (`git worktree list --porcelain`), it explains the policy; if it detects an extra worktree, it warns that a previous agent session may still have work in progress there and to close/merge that first. `settings.json` also sets `worktree.bgIsolation: "none"` so background sessions can still edit files directly without ever needing `EnterWorktree` to unlock that.
