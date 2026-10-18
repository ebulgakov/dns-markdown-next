// Preload side effect: DOM globals (window, document, ...) for React Testing Library.
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { jest, vi } from "bun:test";

// A real origin (instead of about:blank) so relative requests like axios.get("/api/...") resolve
// and MSW handlers with relative paths match them.
GlobalRegistrator.register({ url: "http://localhost:3000" });

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
