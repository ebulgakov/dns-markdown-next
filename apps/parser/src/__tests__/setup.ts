// Boundary mocks for every parser test, preloaded via bunfig.toml ([test] preload).
//
// Bun's mock.module is process-wide and every test file runs in the same process, so only the
// outer boundaries are mocked — and always here, the same way for every test file:
//   - @src/env         → a mutable `env` object (tests tweak CITY / WRITE_STRATEGY / KEYS)
//   - @src/api/client  → axios transports replaced by mocks (the real @dns-markdown/api-client
//                        endpoints run on top)
//   - @src/email/index → the Resend client
// Fixtures live in @dns-markdown/tests/fixtures.
import { createApiClient } from "@dns-markdown/api-client";
import { createHttpMock } from "@dns-markdown/tests/http";
import { logError } from "@src/api/log-error";
import { mock } from "bun:test";

const defaultEnv = {
  API_URL: "http://api.test",
  API_SECRET_KEY: "test-secret-key",
  API_SERVICE_KEY: "test-service-key",
  WEB_URL: "http://web.test",
  WEBHOOK_SECRET_KEY: "test-webhook-key",
  UPSTASH_VECTOR_REST_URL: "https://vector.test",
  UPSTASH_VECTOR_REST_TOKEN: "test-vector-token",
  RESEND_API_KEY: "re_test",
  CITY: "samara" as string | undefined,
  WRITE_STRATEGY: "insert" as "insert" | "replace",
  KEYS: "daily:*"
};

export const env = { ...defaultEnv };

const http = createHttpMock();
const web = createHttpMock();

export const { get: apiGet, post: apiPost, mockGetResponses, postBody, postedEndpoints } = http;
export const webPost = web.post;
export const resendBatchSend = mock<
  (emails: unknown[]) => Promise<{ data?: unknown; error?: { message: string } | null }>
>(async () => ({ data: null, error: null }));

mock.module("@src/env", () => ({ env }));
mock.module("@src/api/client", () => ({
  api: createApiClient({ http, onError: logError }),
  webClient: { post: webPost }
}));
mock.module("@src/email/index", () => ({
  default: { batch: { send: resendBatchSend } }
}));

// Reset env and all boundary mocks; call it in beforeEach.
export const resetMocks = () => {
  Object.assign(env, defaultEnv);
  http.reset();
  web.reset();
  resendBatchSend.mockReset();
  resendBatchSend.mockImplementation(async () => ({ data: null, error: null }));
};
