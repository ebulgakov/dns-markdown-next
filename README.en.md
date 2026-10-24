[Русский](./README.md) | English

# Dns-Markdown

Service for browsing discounted (markdown) products of the DNS store: website, mobile app, API and data parser in one monorepo.

## Site URL

https://dns.ebulgakov.com/

## About

This is an unofficial website related to the DNS company. It helps you browse discounted items listed on the DNS website.

For now the service shows products from Samara and Moscow (the city is switched in the site header). You can add items to your favorites to keep track of updates, such as price changes or product availability in stores.

<img width="1920" height="1758" alt="Arc 2026-10-24 10 04 10" src="https://github.com/user-attachments/assets/26b688dc-c59b-4d6b-82a0-eedf0cda7169" />

## Workspaces

| Path                  | Package                    | Description                                                                 | Docs                                                                |
| --------------------- | -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `apps/web`            | `@dns-markdown/web`        | Next.js (App Router) site, deployed to Vercel                               | [README](apps/web/README.md), [CLAUDE.md](apps/web/CLAUDE.md)       |
| `apps/api`            | `@dns-markdown/api`        | Express API (MongoDB/Mongoose), deployed to Vercel                          | [README](apps/api/README.md), [CLAUDE.md](apps/api/CLAUDE.md)       |
| `apps/parser`         | `@dns-markdown/parser`     | DNS markdown scraper/ETL, pushes data to the API, runs locally              | [README](apps/parser/README.md), [CLAUDE.md](apps/parser/CLAUDE.md) |
| `apps/mobile`         | `@dns-markdown/mobile`     | Expo (React Native, expo-router) app for iOS and Android, built with EAS    | [README](apps/mobile/README.md), [CLAUDE.md](apps/mobile/CLAUDE.md) |
| `packages/env`        | `@dns-markdown/env`        | Shared env-file loading and `NODE_ENV`/platform checks                      | [CLAUDE.md](packages/env/CLAUDE.md)                                 |
| `packages/types`      | `@dns-markdown/types`      | Shared API payload and response types                                       | [CLAUDE.md](packages/types/CLAUDE.md)                               |
| `packages/api-client` | `@dns-markdown/api-client` | Typed axios client for every API endpoint                                   | [CLAUDE.md](packages/api-client/CLAUDE.md)                          |
| `packages/tests`      | `@dns-markdown/tests`      | Shared test utilities: fixtures, HTTP/Express/Mongoose doubles, DOM, timers | [CLAUDE.md](packages/tests/CLAUDE.md)                               |

## Tooling

[Bun](https://bun.sh) workspaces (`apps/*`, `packages/*`) with a single `bun.lock`, orchestrated by [Nx](https://nx.dev) in package-based mode: Nx targets are the `package.json` scripts of each workspace, caching rules live in `nx.json`.

- Bun is the package manager, runtime and test runner; its version is pinned in the root `package.json` `packageManager` field. The exception is `apps/mobile`: tests run on Jest (`jest-expo`), linting via `expo lint`.
- Node (needed by `next`, `storybook`, `eslint`, `expo`) is pinned in [`.nvmrc`](.nvmrc).
- For `apps/mobile`: Xcode (iOS) and/or Android Studio (Android) — the app runs in its own dev client, not in Expo Go.
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

Mobile app (from `apps/mobile/`):

```bash
bun run ios            # build and run the dev client in the iOS simulator (or bun run android)
bun run start          # start Metro for an already installed dev client
```

## Commands

Run from the repo root:

```bash
bun install            # install all workspaces
bun run dev            # dev targets of all projects (api in watch mode, web on :3000)
bun run test           # tests of all projects (mobile on Jest, the rest on bun test)
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

The exception is `apps/mobile`: Expo reads `EXPO_PUBLIC_*` vars (e.g. `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`) only from `apps/mobile/.env*` and inlines them into the bundle, so never put a secret behind that prefix.

## CI

GitHub Actions (`.github/workflows/`) on push/PR to `main`: ESLint, `tsc --noEmit`, tests of every workspace, the API's `openapi.json` freshness check, Playwright and dependency-cruiser for web. Chromatic runs only on PRs labeled `chromatic`.

## Technologies

- Bun, Nx, TypeScript, Zod
- Next.js 16, React 19, Tailwind CSS, shadcn/ui, next-intl, TanStack Query, Zustand
- Expo SDK 57, React Native, expo-router, NativeWind, EAS (mobile app)
- Express 5, Swagger
- MongoDB (Mongoose), Redis (Upstash)
- Clerk Auth
- Upstash Vector DB
- OpenAI API
- cheerio, Resend (parser)
- Storybook, Chromatic, Playwright, Bun test, Jest (mobile)
- Sentry, OpenTelemetry
