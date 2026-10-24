# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

Bun workspaces (`apps/*`, `packages/*`) orchestrated by **Nx** (package-based: targets are inferred from each workspace's `package.json` scripts, no Nx plugins; caching rules live in `nx.json`). Single `bun.lock` at the root; `bunfig.toml` pins `linker = "hoisted"` so Vercel can trace external modules from the root `node_modules` (Expo's Metro config resolves the hoisted root `node_modules` out of the box). Shared compiler options live in `tsconfig.base.json`; every workspace `tsconfig.json` except `apps/mobile` extends it (the root `tsconfig.json` covers only root-level config files like `eslint.config.ts`).

Each workspace has its own `CLAUDE.md` with details — read it before working in that workspace:

- `apps/api` (`@dns-markdown/api`) — the Express API (incl. Mongoose models/schemas in `src/db/`), deployed to Vercel. See `apps/api/CLAUDE.md`.
- `apps/web` (`@dns-markdown/web`) — the Next.js (App Router) frontend/BFF, deployed to Vercel; talks to the API over HTTP (`API_URL`). See `apps/web/CLAUDE.md`.
- `apps/mobile` (`@dns-markdown/mobile`) — the Expo SDK 57 (React Native, expo-router, NativeWind) iOS/Android app; runs in a custom dev client (not Expo Go), built with EAS, not deployed to Vercel. No data layer yet (does not call the API). See `apps/mobile/CLAUDE.md`.
- `apps/parser` (`@dns-markdown/parser`) — DNS markdown scraper/ETL (CLI pipeline); pushes data to the API over HTTP, runs locally only (not deployed). See `apps/parser/CLAUDE.md`.
- `packages/env` (`@dns-markdown/env`) — shared env-file loading and `NODE_ENV`/platform checks. See `packages/env/CLAUDE.md`.
- `packages/types` (`@dns-markdown/types`) — shared API payload/response types (JSON wire shapes, no runtime code). See `packages/types/CLAUDE.md`.
- `packages/tests` (`@dns-markdown/tests`) — shared test utilities (fixtures, HTTP/Express/Mongoose doubles, DOM preload, fake timers), devDependency of every Bun-tested app (not `apps/mobile`, which uses Jest). See `packages/tests/CLAUDE.md`.
- `packages/api-client` (`@dns-markdown/api-client`) — typed axios client for every `apps/api` endpoint, used by web and parser; React Native compatible (no env, no Next) so `apps/mobile` can adopt it when it gets a data layer. See `packages/api-client/CLAUDE.md`.

Root `package.json` `overrides` pin packages shared by web and mobile to one hoisted copy (`react`, `react-dom`, `@types/react`, `uuid`) — two copies of `@types/react` break `apps/web` type-check. When bumping the Expo SDK, keep these in line with the versions it expects.

## Commands

This project uses **Bun** (not npm/node) as the package manager and runtime. Run from the repo root:

```bash
bun install                 # install all workspaces
bun run dev                 # dev targets of all projects (api watch mode, web on :3000; mobile has no dev target)
bun run test                # nx run-many -t test (not cached: env files are not part of the cache key)
bun run lint                # nx run-many -t lint
bun run lint:fix            # nx run-many -t lint:fix (each project's own eslint config, `expo lint --fix` for mobile)
bun run type-check          # nx run-many -t type-check
bun run build               # nx run-many -t build
bun run affected            # lint/type-check/test/build only for projects changed vs main
bunx nx run <project>:<script>   # any single script of one project, e.g. @dns-markdown/api:dev:prod
```

Nx runs every target with cwd = the project root. Root scripts set `NX_LOAD_DOT_ENV_FILES=false`: otherwise Nx injects the root `.env*` files into every task's environment, which leaks the API's vars (including `NODE_ENV`) into `apps/web` and breaks `next build` — so when calling `bunx nx` directly, prefix it the same way. Prefer `bun run test` (Nx, one process per project). A bare `bun test` from the root also works for the Bun-tested workspaces (runs them in one process; it does not run the mobile Jest suite); the parser's test preload is therefore set in both `bunfig.toml` (root) and `apps/parser/bunfig.toml` — keep them in sync.

`apps/mobile` exceptions: `test` is Jest (`jest-expo`), not `bun test`; native commands (`bun run ios|android|start|prebuild:*`) are run from `apps/mobile/` and need Xcode / Android Studio; mobile dependencies are added with `npx expo install <pkg>` inside `apps/mobile/` (keeps versions aligned with the SDK), not `bun add`.

The husky pre-commit hook runs lint-staged (nearest `.lintstagedrc.json`: root, `apps/web` or `apps/mobile`) and then `bun run type-check` for every project. `.claude/skills/` is in `.prettierignore` — vendored skills stay byte-identical to upstream (`skills-lock.json`).

## Env files

Env files are shared by the Bun workspaces and live in the **monorepo root**: `.env.<NODE_ENV>` (`.env.development`, `.env.test`, `.env.production`) is loaded first, then the common `.env` (already set vars are never overridden). Loading is done by `loadEnv()` from `@dns-markdown/env`; each app validates only its own variables with its own zod schema. In production there are no env files — Vercel injects the API's vars (the parser is not deployed). A key both apps share (`API_SECRET_KEY`, `API_SERVICE_KEY`, `UPSTASH_VECTOR_*`) lives once in the shared file; per-app differences go into the app's `package.json` scripts (e.g. the parser's `CITY` / `WRITE_STRATEGY`). Keep `CITY` out of the shared `.env` — parser stages rely on it being set only by their scripts. All keys are listed in the root `.env.example`. Never read `process.env` directly outside an app's env module or `packages/env`.

`apps/web` included: Next.js itself only reads `apps/web/.env*`, so `apps/web/next.config.ts` calls `loadEnv()` from `@dns-markdown/env` before Next compiles anything — server code then reads the vars from `process.env` and `NEXT_PUBLIC_*` get inlined into the client bundle. Do not put env files into `apps/web/`.

`apps/mobile` is the exception: it is not wired to `loadEnv()`. Expo CLI reads `EXPO_PUBLIC_*` vars (e.g. `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`) only from `apps/mobile/.env*` and inlines them into the JS bundle shipped to devices — never put a secret (e.g. `API_SECRET_KEY`) behind that prefix or into the mobile env file.

## Code style

Enforced by the root `eslint.config.ts` and `.prettierrc` for all workspaces except `apps/web` and `apps/mobile`, which the root ESLint config ignores: `apps/web` has its own `eslint.config.mjs` (Next, FSD boundaries, Storybook rules), `.prettierrc` (Tailwind plugin) and `.lintstagedrc.json`; `apps/mobile` has its own `eslint.config.js` (`eslint-config-expo` + prettier plugin, run via `expo lint`) and `.lintstagedrc.json`, and uses the root `.prettierrc`. Common rules: no semicolon-trailing commas, double quotes, 100-char print width, arrow function params unparenthesized when single-arg. Import order is enforced (builtin → external → internal → parent → sibling → index → type) with alphabetization and mandatory blank lines between groups — let `bun run lint:fix` handle this rather than ordering imports by hand.

Apps except `apps/web` and `apps/mobile` share one layout: code in `src/`, kebab-case file and folder names, `@src/*` → `src/*` alias (tsconfig `paths`) for cross-directory imports, relative imports within a folder, no file extensions in imports. `apps/web` (Next.js) and `apps/mobile` (Expo) use a Feature-Sliced Design layout with kebab-case files too, but `@/…` aliases instead of `@src/*` (per FSD layer in web, a single `@/*` → `src/*` in mobile) — see their `CLAUDE.md`. Cross-workspace imports go through the workspace package name (`@dns-markdown/types/...`, `@dns-markdown/api-client`, `@dns-markdown/env`), never through relative paths into another workspace.

## Subagents

Subagent roster and routing are defined in AGENTS.md (single source of truth for Claude Code and other CLIs): @AGENTS.md — web specialists own `apps/web`, `mobile-*` agents own `apps/mobile`, `team-lead` covers both.

## Worktree policy

Never use `EnterWorktree` in this repo — always work directly in the current branch/checkout. This is enforced by a `PreToolUse` hook (`.claude/hooks/block-worktree.sh`, wired up in `.claude/settings.json`) that denies every `EnterWorktree` call: if it detects only the main checkout (`git worktree list --porcelain`), it explains the policy; if it detects an extra worktree, it warns that a previous agent session may still have work in progress there and to close/merge that first. `settings.json` also sets `worktree.bgIsolation: "none"` so background sessions can still edit files directly without ever needing `EnterWorktree` to unlock that.
