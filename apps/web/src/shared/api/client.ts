import { createApiClient } from "@dns-markdown/api-client";

import { env } from "@/shared/config";

export const api = createApiClient({
  baseURL: env.API_URL,
  apiSecret: env.API_SECRET_KEY,
  onError: (endpoint, error) => console.error(`Error fetching data from ${endpoint}:`, error)
});
