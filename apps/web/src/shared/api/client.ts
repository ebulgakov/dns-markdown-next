import { createApiClient } from "@dns-markdown/api-client";

export const api = createApiClient({
  baseURL: process.env.API_URL || "",
  apiSecret: process.env.API_SECRET_KEY || "",
  onError: (endpoint, error) => console.error(`Error fetching data from ${endpoint}:`, error)
});
