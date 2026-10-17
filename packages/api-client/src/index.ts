import { createAnalysisApi } from "./endpoints/analysis";
import { createLLMApi } from "./endpoints/llm";
import { createPriceListApi } from "./endpoints/pricelist";
import { createProductsApi } from "./endpoints/products";
import { createServiceApi } from "./endpoints/service";
import { createUserApi } from "./endpoints/user";
import { createHttpClient } from "./http";
import { createRequest } from "./request";

import type { HttpConfig, HttpLike } from "./http";
import type { ErrorHandler } from "./request";

export type ApiClientConfig = (HttpConfig | { http: HttpLike }) & {
  // Called with the endpoint and the error before it is rethrown, e.g. for logging
  onError?: ErrorHandler;
};

export const createApiClient = (config: ApiClientConfig) => {
  const http = "http" in config ? config.http : createHttpClient(config);
  const request = createRequest(http, config.onError);

  return {
    http,
    pricelist: createPriceListApi(request),
    products: createProductsApi(request),
    analysis: createAnalysisApi(request),
    llm: createLLMApi(request),
    user: createUserApi(request),
    service: createServiceApi(request)
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;

export { createHttpClient };
export type { ErrorHandler, HttpConfig, HttpLike };
