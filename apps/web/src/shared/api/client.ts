import { createApiClient } from "@dns-markdown/api-client";
import { isAxiosError } from "axios";

import { env } from "@/shared/config";

// An AxiosError carries the request config, including the auth headers with the API keys, so
// only non-secret fields are logged
const describeError = (error: unknown) => {
  if (!isAxiosError(error)) return error;

  return {
    message: error.message,
    code: error.code,
    method: error.config?.method,
    url: error.config?.url,
    params: error.config?.params,
    status: error.response?.status,
    data: error.response?.data
  };
};

export const api = createApiClient({
  baseURL: env.API_URL,
  apiSecret: env.API_SECRET_KEY,
  onError: (endpoint, error) =>
    console.error(`Error fetching data from ${endpoint}:`, describeError(error))
});
