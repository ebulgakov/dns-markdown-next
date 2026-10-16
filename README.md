# dns-markdown

Monorepo (Bun workspaces + Nx): `apps/web` — Next.js site ([README](apps/web/README.md)), `apps/api` — Express API, `apps/parser` — DNS markdown scraper ([README](apps/parser/README.md)), `packages/db` — shared Mongoose models, `packages/env` — shared env loading.

<img width="2574" height="2342" alt="image" src="https://github.com/user-attachments/assets/a6922841-1aa0-4801-9577-50f47bc80b34" />

## API docs

- [API-Enpoints Documentation](apps/api/API.md)
- [Swagger URL](https://dns-markdown-api.vercel.app/docs/)

## Commands

Install:

```bash
bun install
```

Run dev build:

```bash
bun run dev       # api
bun run dev:web   # web (Next.js, :3000)
```

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
