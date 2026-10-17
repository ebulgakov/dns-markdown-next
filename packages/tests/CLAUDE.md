# packages/tests — `@dns-markdown/tests`

Shared test utilities for every workspace (`bun:test`). A devDependency only — never import it from runtime code. Monorepo-wide rules are in the root `CLAUDE.md`.

## Exports

- `./fixtures` — `makeGoods`, `makePriceList`, `makeAnalysisData`, `makeAnalysisDiff`, `makeUser`: factories typed by `@dns-markdown/types`, each takes `overrides`. **Pure data, no `bun:test` import**, so they stay usable outside Bun (e.g. Storybook). Add a factory only when a test needs it.
- `./http` — `createHttpMock(defaultData?)`: `{ get, post }` transport for `createApiClient({ http })` plus `mockGetResponses`, `postBody`, `postedEndpoints`, `reset`.
- `./express` — `createExpressMocks()`: `req`/`res`/`next`/`json`/`send`/`status` for calling an Express handler directly, `reset(requestFields)` in `beforeEach`. `mockQuery(result)`: Mongoose `find().sort().lean().exec()` chain double.
- `./dom` — side-effect module for a preload: registers happy-dom globals and fixes Bun's stale fake-timer marker for Testing Library.
- `./timers` — `advanceTimersByTimeAsync` (Bun has no `vi.advanceTimersByTimeAsync`).

## Rules

- **App-alias wiring stays in the app.** `mock.module("@src/...")` calls live in each app's preloaded `src/__tests__/setup.ts` (`apps/parser`, `apps/api`) or `test/setup.ts` (`apps/web`); this package exports only mock objects and factories, and never calls `mock.module` itself.
- `mock.module` is process-wide (a root `bun test` runs every workspace in one process): a boundary mocked in an app's setup file must not be re-mocked in a test file.
- No `test` script: the package is exercised through the consumers' tests.
