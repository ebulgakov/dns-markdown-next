# @dns-markdown/api

Express 5 API for [dns-markdown](../../README.md), deployed to Vercel as a single serverless function (the bundled `dist/index.js`). It owns the price list, product, analysis and user data (MongoDB via Mongoose, models in `src/db/`), caches responses in Upstash Redis and generates LLM reports with OpenAI + Upstash Vector.

## API docs

- [API-Endpoints Documentation](API.md) (in Russian)
- [Swagger URL](https://dns-markdown-api.vercel.app/docs/)

Regenerate `openapi.json` after changing routes (CI fails if it is stale): `bunx nx run @dns-markdown/api:generate:openapi`.

## Routes and auth

- `/health` — no auth.
- `/api/*` (`pricelist`, `products`, `analysis`, `llm`, `user`) — Clerk session + `X-Internal-API-Secret` header (`API_SECRET_KEY`); called by `apps/web`.
- `/clerk/*` — Clerk webhooks, verified with `svix`.
- `/service/*` — machine-to-machine routes (`Authorization: Bearer <API_SERVICE_KEY>`); called by `apps/parser`.

Clients should use the typed client from [`@dns-markdown/api-client`](../../packages/api-client/CLAUDE.md).

## Commands

Run from the monorepo root (`bun install` first):

```bash
bunx nx run @dns-markdown/api:dev          # dev server with watch mode (NODE_ENV=development)
bunx nx run @dns-markdown/api:dev:test     # same with NODE_ENV=test
bunx nx run @dns-markdown/api:dev:prod     # same with NODE_ENV=production (real prod services)
bunx nx run @dns-markdown/api:build        # bundle to dist/index.js
bunx nx run @dns-markdown/api:start        # run the built bundle
bunx nx run @dns-markdown/api:test         # bun test
bunx nx run @dns-markdown/api:test:watch
bunx nx run @dns-markdown/api:lint
bunx nx run @dns-markdown/api:type-check
```

Prefix direct `bunx nx` calls with `NX_LOAD_DOT_ENV_FILES=false` (root scripts already do), otherwise Nx injects the root `.env*` files into every task. Inside `apps/api` the same scripts run as `bun run <script>`.

Tests use `bun:test` and the shared helpers from `@dns-markdown/tests`; the env vars required by `src/env.ts` must be set (see `.github/workflows/test.yml` for dummy CI values).

## .env

Env vars live in the shared `.env*` files in the monorepo root (see the root `.env.example`) and are validated by the zod schema in `src/env.ts`. In production Vercel injects them.

## Technologies

- Express 5, Bun, TypeScript, Zod
- MongoDB (Mongoose)
- Redis (Upstash)
- Clerk Auth (+ svix webhooks)
- Upstash Vector DB
- OpenAI API
- Swagger
- Sentry, OpenTelemetry
