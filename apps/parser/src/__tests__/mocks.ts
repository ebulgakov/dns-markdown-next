// Shared test doubles for the parser.
//
// Bun's mock.module is process-wide and every test file runs in the same process, so only the
// outer boundaries are mocked — and always here, the same way for every test file:
//   - @src/env         → a mutable `env` object (tests tweak CITY / WRITE_STRATEGY / KEYS)
//   - @src/api/client  → axios transports replaced by mocks (the real @dns-markdown/api-client
//                        endpoints run on top)
//   - @src/email/index → the Resend client
// Preloaded for every test file via bunfig.toml ([test] preload); tests import it for the mocks.
import { createApiClient } from "@dns-markdown/api-client";
import { logError } from "@src/api/log-error";
import { mock } from "bun:test";

import type { AnalysisData } from "@dns-markdown/types/analysis-data";
import type { Goods, PriceList } from "@dns-markdown/types/pricelist";
import type { User } from "@dns-markdown/types/user";

type TestEnv = {
  API_URL: string;
  API_SECRET_KEY: string;
  API_SERVICE_KEY: string;
  WEB_URL: string;
  WEBHOOK_SECRET_KEY: string;
  UPSTASH_VECTOR_REST_URL: string;
  UPSTASH_VECTOR_REST_TOKEN: string;
  RESEND_API_KEY: string;
  CITY: string | undefined;
  WRITE_STRATEGY: "insert" | "replace";
  KEYS: string;
};

const defaultEnv: TestEnv = {
  API_URL: "http://api.test",
  API_SECRET_KEY: "test-secret-key",
  API_SERVICE_KEY: "test-service-key",
  WEB_URL: "http://web.test",
  WEBHOOK_SECRET_KEY: "test-webhook-key",
  UPSTASH_VECTOR_REST_URL: "https://vector.test",
  UPSTASH_VECTOR_REST_TOKEN: "test-vector-token",
  RESEND_API_KEY: "re_test",
  CITY: "samara",
  WRITE_STRATEGY: "insert",
  KEYS: "daily:*"
};

export const env: TestEnv = { ...defaultEnv };

type ClientCall = (endpoint: string, payload?: unknown) => Promise<{ data: unknown }>;

export const apiGet = mock<ClientCall>(async () => ({ data: undefined }));
export const apiPost = mock<ClientCall>(async () => ({ data: undefined }));
export const webPost = mock<ClientCall>(async () => ({ data: undefined }));
export const resendBatchSend = mock<
  (emails: unknown[]) => Promise<{ data?: unknown; error?: { message: string } | null }>
>(async () => ({ data: null, error: null }));

mock.module("@src/env", () => ({ env }));
mock.module("@src/api/client", () => ({
  api: createApiClient({ http: { get: apiGet, post: apiPost }, onError: logError }),
  webClient: { post: webPost }
}));
mock.module("@src/email/index", () => ({
  default: { batch: { send: resendBatchSend } }
}));

// Reset env and all boundary mocks; call it in beforeEach.
export const resetMocks = () => {
  Object.assign(env, defaultEnv);
  for (const fn of [apiGet, apiPost, webPost, resendBatchSend]) fn.mockReset();
  apiGet.mockImplementation(async () => ({ data: undefined }));
  apiPost.mockImplementation(async () => ({ data: undefined }));
  webPost.mockImplementation(async () => ({ data: undefined }));
  resendBatchSend.mockImplementation(async () => ({ data: null, error: null }));
};

// Route apiClient.get responses by endpoint.
export const mockGetResponses = (responses: Record<string, unknown>) => {
  apiGet.mockImplementation(async (endpoint: string) => {
    if (!(endpoint in responses)) throw new Error(`Unexpected GET ${endpoint}`);
    return { data: responses[endpoint] };
  });
};

// Find the body of the first POST to an endpoint.
export const postBody = (endpoint: string) =>
  apiPost.mock.calls.find(([url]) => url === endpoint)?.[1];

export const postedEndpoints = () => apiPost.mock.calls.map(([url]) => url);

// ---- Fixtures ----

export const makeGoods = (overrides: Partial<Goods> = {}): Goods => ({
  _id: "goods-id",
  title: "Phone",
  link: "/product/phone/",
  description: "Black, 128 GB",
  reasons: [{ _id: "reason-id", label: "Внешний вид", text: "Царапины" }],
  priceOld: "1000",
  price: "800",
  profit: "200",
  code: "12345",
  image: "https://img.test/phone.jpg",
  available: "В наличии",
  ...overrides
});

export const makePriceList = (overrides: Partial<PriceList> = {}): PriceList => ({
  _id: "pricelist-id",
  city: "samara",
  createdAt: "2026-10-16T10:00:00.000Z",
  positions: [{ _id: "position-id", title: "Смартфоны", items: [makeGoods()] }],
  ...overrides
});

export const makeAnalysisData = (overrides: Partial<AnalysisData> = {}): AnalysisData => ({
  ...makeGoods(),
  city: "samara",
  category: "Смартфоны",
  dateAdded: "2026-10-16T10:00:00.000Z",
  ...overrides
});

export const makeUser = (overrides: Partial<User> = {}): User => ({
  _id: "user-id",
  userId: "clerk-user-id",
  email: "user@example.com",
  city: "samara",
  shownBoughtFavorites: false,
  hiddenSections: [],
  favoriteSections: [],
  notifications: { updates: { enabled: true } },
  favorites: [
    {
      _id: "favorite-id",
      status: {
        createdAt: "2026-10-01T10:00:00.000Z",
        updatedAt: "2026-10-01T10:00:00.000Z",
        deleted: false,
        city: "samara"
      },
      item: makeGoods()
    }
  ],
  ...overrides
});
