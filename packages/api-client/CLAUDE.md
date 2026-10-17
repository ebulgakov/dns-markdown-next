# packages/api-client — `@dns-markdown/api-client`

Typed HTTP client for every `apps/api` endpoint. Used by `apps/web` (server side), `apps/parser`, and meant for the Expo app. Monorepo-wide rules are in the root `CLAUDE.md`.

## API (`src/index.ts`)

`createApiClient(config)` returns `{ http, pricelist, products, analysis, llm, user, service }`:

- `config` is either `{ baseURL, apiSecret?, serviceKey?, timeout? }` (an axios instance is created by `createHttpClient`: `apiSecret` → `X-Internal-API-Secret`, `serviceKey` → `Authorization: Bearer`) or `{ http }` with any `{ get, post }` transport (tests).
- `onError?: (endpoint, error) => void` is called before an error is rethrown — consumers log here; the package itself never logs.
- Methods return the unwrapped `response.data`, typed with `@dns-markdown/types`.
- `user.*` methods take the caller's Clerk session token as the first argument (sent as a per-request `Authorization: Bearer`); every user route is a POST, including `user.get`.
- `service.*` (`/service/*`) need `serviceKey` and are for the parser only.

## Rules

- **Must run in React Native**: no `process.env`, no Next.js, no Node-only APIs (`node:*`). Config is passed in by the caller.
- `package.json` keeps `main` alongside `exports`: Metro (Expo) may not resolve package `exports`, so `main` is the fallback entry. Keep both pointing at `./src/index.ts`.
- Endpoint path, HTTP method and params mirror the routers in `apps/api/src/*-routes/index.ts` — check them, don't infer the method from a method name.
- Call shape is relied upon by consumer tests: `http.get(path, { params })` and `http.post(path, body)`; only user calls pass a third config argument.
- Adding an endpoint: add the method to the matching `src/endpoints/<group>.ts` and a case to `src/__tests__/api-client.test.ts`. Tests inject `{ http }` mocks; never use `mock.module` (a root `bun test` runs every workspace in one process).
- Caching (`unstable_cache`, React Query, …) belongs to the consumer, not here.
