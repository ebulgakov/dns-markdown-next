# packages/tests — `@dns-markdown/tests`

Shared test utilities for every workspace (`bun:test`). A devDependency only — never import it from runtime code. Monorepo-wide rules are in the root `CLAUDE.md`.

## Exports

- `./fixtures` — `makeGoods`, `makePriceList`, `makeAnalysisData`, `makeAnalysisDiff`, `makeUser`: factories typed by `@dns-markdown/types`, each takes `overrides`. **Pure data, no `bun:test` import**, so they stay usable outside Bun (e.g. Storybook). Add a factory only when a test needs it.
- `./http` — `createHttpMock(defaultData?)`: `{ get, post }` transport for `createApiClient({ http })` plus `mockGetResponses`, `postBody`, `postedEndpoints`, `reset`.
- `./express` — `createExpressMocks()`: `req`/`res`/`next`/`json`/`send`/`status` for calling an Express handler directly, `reset(requestFields)` in `beforeEach`. `mockQuery(result)`: Mongoose `find().sort().lean().exec()` chain double.
- `./dom` — side-effect module for a preload: registers happy-dom globals and fixes Bun's stale fake-timer marker for Testing Library.
- `./timers` — `advanceTimersByTimeAsync` (Bun has no `vi.advanceTimersByTimeAsync`).
- `./msw` — `webApiHandlers`: default MSW handlers for `apps/web`'s own `/api/*` routes, built from the fixtures. Pure (no `bun:test` import): shared by `setupServer` in web unit tests (`apps/web/test/msw-server.ts`) and `setupWorker` in Storybook (`apps/web/.storybook/preview.tsx`). Relative paths: they match the happy-dom origin `http://localhost:3000` set in `./dom`.

## Rules

- **App-alias wiring stays in the app.** `mock.module("@src/...")` calls live in each app's preloaded `src/__tests__/setup.ts` (`apps/parser`, `apps/api`) or `test/setup.ts` (`apps/web`); this package exports only mock objects and factories, and never calls `mock.module` itself.
- `mock.module` is process-wide (a root `bun test` runs every workspace in one process): a boundary mocked in an app's setup file must not be re-mocked in a test file.
- **MSW stays on v2.** msw v3's Node interceptors patch `net` sockets, which fails under Bun (`Failed to replace a global value at "_wrapHandle"`) and leaves requests unmocked. MSW is for client-side requests only (axios/`useQuery` to `/api/*`); `@dns-markdown/api-client` consumers keep injecting `createHttpMock()`.
- No `test` script: the package is exercised through the consumers' tests.
