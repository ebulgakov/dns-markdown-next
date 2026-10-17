import { vi } from "bun:test";

const STEP_MS = 1;

async function flushMicrotasks() {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

// Bun has no vi.advanceTimersByTimeAsync: advance fake time in small steps and
// let promise callbacks run between steps, so timers scheduled from async code
// (e.g. TanStack Query retry delays) fire within the same window.
export async function advanceTimersByTimeAsync(ms: number) {
  for (let elapsed = 0; elapsed < ms; elapsed += STEP_MS) {
    await flushMicrotasks();
    vi.advanceTimersByTime(Math.min(STEP_MS, ms - elapsed));
  }
  await flushMicrotasks();
}
