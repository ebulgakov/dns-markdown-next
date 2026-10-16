# dns-markdown-api

Express API for [dns-markdown](../../README.md), deployed to Vercel.

## API docs

- [API-Endpoints Documentation](API.md)
- [Swagger URL](https://dns-markdown-api.vercel.app/docs/)

Regenerate `openapi.json` after changing routes (CI fails if it is stale): `bunx nx run @dns-markdown/api:generate:openapi`.

## Commands

Run from the monorepo root (`bun install` first):

```bash
bunx nx run @dns-markdown/api:dev        # dev server with watch mode (NODE_ENV=development)
bunx nx run @dns-markdown/api:dev:test   # same with NODE_ENV=test
bunx nx run @dns-markdown/api:dev:prod   # same with NODE_ENV=production
bunx nx run @dns-markdown/api:test
bunx nx run @dns-markdown/api:build
```

Prefix direct `bunx nx` calls with `NX_LOAD_DOT_ENV_FILES=false` (root scripts already do), otherwise Nx injects the root `.env*` files into every task.

## .env

Env vars live in the shared `.env*` files in the monorepo root (see the root `.env.example`). In production Vercel injects them.

## Technologies

- Express
- Bun
- MongoDB
- Typescript
- Redis
- Clerk Auth
- Upstash Vector DB
- OpenAI API
- Swagger
