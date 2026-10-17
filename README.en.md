[Русский](./README.md) | English

# Dns-Markdown

Service for browsing discounted (markdown) products of the DNS store: website, API and data parser in one monorepo.

## Site URL

https://dns.ebulgakov.com/

## About

This is an unofficial website related to the DNS company. It helps you browse discounted items listed on the DNS website.

For now the service shows products from Samara and Moscow (the city is switched in the site header). You can add items to your favorites to keep track of updates, such as price changes or product availability in stores.

<img width="2574" height="2342" alt="image" src="https://github.com/user-attachments/assets/a6922841-1aa0-4801-9577-50f47bc80b34" />

## Workspaces

| Path                  | Package                    | Description                                                                 | Docs                                                                |
| --------------------- | -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `apps/web`            | `@dns-markdown/web`        | Next.js (App Router) site, deployed to Vercel                               | [README](apps/web/README.md), [CLAUDE.md](apps/web/CLAUDE.md)       |
| `apps/api`            | `@dns-markdown/api`        | Express API (MongoDB/Mongoose), deployed to Vercel                          | [README](apps/api/README.md), [CLAUDE.md](apps/api/CLAUDE.md)       |
| `apps/parser`         | `@dns-markdown/parser`     | DNS markdown scraper/ETL, pushes data to the API, runs locally              | [README](apps/parser/README.md), [CLAUDE.md](apps/parser/CLAUDE.md) |
| `packages/env`        | `@dns-markdown/env`        | Shared env-file loading and `NODE_ENV`/platform checks                      | [CLAUDE.md](packages/env/CLAUDE.md)                                 |
| `packages/types`      | `@dns-markdown/types`      | Shared API payload and response types                                       | [CLAUDE.md](packages/types/CLAUDE.md)                               |
| `packages/api-client` | `@dns-markdown/api-client` | Typed axios client for every API endpoint                                   | [CLAUDE.md](packages/api-client/CLAUDE.md)                          |
| `packages/tests`      | `@dns-markdown/tests`      | Shared test utilities: fixtures, HTTP/Express/Mongoose doubles, DOM, timers | [CLAUDE.md](packages/tests/CLAUDE.md)                               |

## Tooling

[Bun](https://bun.sh) workspaces (`apps/*`, `packages/*`) with a single `bun.lock`, orchestrated by [Nx](https://nx.dev) in package-based mode: Nx targets are the `package.json` scripts of each workspace, caching rules live in `nx.json`.

- Bun is the package manager, runtime and test runner; its version is pinned in the root `package.json` `packageManager` field.
- Node (needed by `next`, `storybook`, `eslint`) is pinned in [`.nvmrc`](.nvmrc).
- Pre-commit hooks: husky + lint-staged.

## Getting started

```bash
git clone --recurse-submodules git@github.com:ebulgakov/dns-markdown-next.git
# or, in an existing clone:
git submodule update --init   # private submodule with the scraper scripts (parser only)

bun install
cp .env.example .env          # fill in the required variables
bun run dev
```

## Commands

Run from the repo root:

```bash
bun install            # install all workspaces
bun run dev            # dev targets of all projects (api in watch mode, web on :3000)
bun run test           # tests of all projects
bun run lint           # lint all projects
bun run lint:fix       # lint with --fix
bun run type-check     # tsc --noEmit for all projects
bun run build          # build all projects
bun run affected       # lint/type-check/test/build only for projects changed vs main
```

Single project / script:

```bash
NX_LOAD_DOT_ENV_FILES=false bunx nx run <project>:<script>   # e.g. @dns-markdown/api:dev
bunx nx graph                                                # project graph
```

`NX_LOAD_DOT_ENV_FILES=false` stops Nx from injecting the root `.env*` files into every task (root scripts already set it).

## Env

All workspaces, `apps/web` included, share env files in the repo root: `.env.<NODE_ENV>` (`.env.development`, `.env.test`, `.env.production`) is loaded first, then `.env`; already set vars are never overridden. Every key is listed in [`.env.example`](.env.example). Next.js itself only reads `apps/web/.env*`, so `apps/web/next.config.ts` loads the root files with `loadEnv()` from `@dns-markdown/env` — do not put env files into `apps/web/`. In production Vercel injects the vars.

## CI

GitHub Actions (`.github/workflows/`) on push/PR to `main`: ESLint, `tsc --noEmit`, tests of every workspace, the API's `openapi.json` freshness check, Playwright and dependency-cruiser for web. Chromatic runs only on PRs labeled `chromatic`.

## Technologies

- Bun, Nx, TypeScript, Zod
- Next.js 16, React 19, Tailwind CSS, shadcn/ui, next-intl, TanStack Query, Zustand
- Express 5, Swagger
- MongoDB (Mongoose), Redis (Upstash)
- Clerk Auth
- Upstash Vector DB
- OpenAI API
- cheerio, Resend (parser)
- Storybook, Chromatic, Playwright, Bun test
- Sentry, OpenTelemetry
