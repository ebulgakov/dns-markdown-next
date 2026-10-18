import { webApiHandlers } from "@dns-markdown/tests/msw";
import { setupServer } from "msw/node";

// MSW server for unit tests that exercise real axios requests to `/api/*`. Not started in the
// preload: a test file opts in with `server.listen()` / `server.resetHandlers()` / `server.close()`,
// so it never intercepts requests of other test files in the same process.
export const server = setupServer(...webApiHandlers);
