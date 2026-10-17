import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { jest, mock, vi } from "bun:test";

// DOM globals (window, document, ...) for React Testing Library.
GlobalRegistrator.register();

// Bun bug: useRealTimers() leaves a `clock` property on setTimeout, which
// Testing Library reads as "fake timers are active" and then calls
// jest.advanceTimersByTime() inside waitFor/act, throwing
// "Fake timers are not active". Drop the stale marker after switching back.
for (const timers of [jest, vi]) {
  const restoreRealTimers = timers.useRealTimers;
  timers.useRealTimers = () => {
    const result = restoreRealTimers();
    delete (setTimeout as { clock?: unknown }).clock;
    return result;
  };
}

// Server modules reachable through slice barrels import "server-only" and
// validate env at import time (src/shared/config/env.ts). Unit tests never
// hit real backends, so stub the guard and provide placeholder values.
mock.module("server-only", () => ({}));
Object.assign(process.env, {
  API_URL: process.env.API_URL ?? "http://localhost:4000",
  API_SECRET_KEY: process.env.API_SECRET_KEY ?? "test-api-secret-key",
  WEBHOOK_SECRET_KEY: process.env.WEBHOOK_SECRET_KEY ?? "test-webhook-secret",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "https://redis.test",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "test-redis-token",
  DEFAULT_CITY: process.env.DEFAULT_CITY ?? "samara"
});
