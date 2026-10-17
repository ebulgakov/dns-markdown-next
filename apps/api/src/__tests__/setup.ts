// Boundary mocks for every api test, preloaded via bunfig.toml ([test] preload).
// mock.module is process-wide, so @src/cache (Redis) is mocked once here and shared;
// db models and helpers under test are mocked in the test file itself.
// Request/response doubles: @dns-markdown/tests/express.
import { mock } from "bun:test";

export const cacheGet = mock<(key: string) => Promise<unknown>>(async () => null);
export const cacheAdd = mock<(key: string, value: unknown, options?: unknown) => Promise<void>>(
  async () => {}
);
export const cacheDelete = mock<(key: string) => Promise<void>>(async () => {});
export const cacheKeys = mock<(pattern: string) => Promise<string[]>>(async () => []);

mock.module("@src/cache", () => ({ cacheGet, cacheAdd, cacheDelete, cacheKeys }));

// Reset the cache mocks to their defaults; call it in beforeEach.
export const resetCache = () => {
  for (const fn of [cacheGet, cacheAdd, cacheDelete, cacheKeys]) fn.mockReset();
  cacheGet.mockImplementation(async () => null);
  cacheAdd.mockImplementation(async () => {});
  cacheDelete.mockImplementation(async () => {});
  cacheKeys.mockImplementation(async () => []);
};
