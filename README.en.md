[Русский](./README.md) | English

# Dns-Markdown

Service for browsing discounted (markdown) products of the DNS store: website, API and data parser in one monorepo.

## Site URL

https://dns.ebulgakov.com/

## About

This is an unofficial website related to the DNS company. It helps you browse discounted items listed on the DNS website.

For now the service shows products from Samara. You can add items to your favorites to keep track of updates, such as price changes or product availability in stores.

<img width="2574" height="2342" alt="image" src="https://github.com/user-attachments/assets/a6922841-1aa0-4801-9577-50f47bc80b34" />

## Workspaces

| Path                  | Package                    | Description                                      | Docs                            |
| --------------------- | -------------------------- | ------------------------------------------------ | ------------------------------- |
| `apps/web`            | `@dns-markdown/web`        | Next.js (App Router) site, deployed to Vercel    | [README](apps/web/README.md)    |
| `apps/api`            | `@dns-markdown/api`        | Express API, deployed to Vercel                  | [README](apps/api/README.md)    |
| `apps/parser`         | `@dns-markdown/parser`     | DNS markdown scraper/ETL, pushes data to the API | [README](apps/parser/README.md) |
| `packages/db`         | `@dns-markdown/db`         | Shared Mongoose models and schemas               |                                 |
| `packages/env`        | `@dns-markdown/env`        | Shared env-file loading and `NODE_ENV` checks    |                                 |
| `packages/types`      | `@dns-markdown/types`      | Shared API payload and response types            |                                 |
| `packages/api-client` | `@dns-markdown/api-client` | Typed client for every API endpoint              |                                 |

## Tooling

[Bun](https://bun.sh) workspaces (`apps/*`, `packages/*`) with a single `bun.lock`, orchestrated by [Nx](https://nx.dev) in package-based mode: Nx targets are the `package.json` scripts of each workspace, caching rules live in `nx.json`.

## Commands

Run from the repo root:

```bash
bun install            # install all workspaces
bun run dev            # dev targets of all projects (api, web on :3000)
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

API, parser and packages share env files in the repo root: `.env.<NODE_ENV>` is loaded first, then `.env` (see `.env.example`). `apps/web` uses its own `apps/web/.env` (see `apps/web/.env-example`).

## Technologies

- Bun, Nx, TypeScript
- Next.js 16, React, Tailwind CSS, shadcn/ui, next-intl
- Express, Swagger
- MongoDB, Redis (Upstash)
- Clerk Auth
- Upstash Vector DB
- OpenAI API
- Storybook, Chromatic, Playwright, Bun test
- Sentry
