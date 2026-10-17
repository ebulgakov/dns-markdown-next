import { createApiClient } from "@dns-markdown/api-client";
import { env } from "@src/env";
import axios from "axios";

import { logError } from "./log-error";

// Axios waits forever by default; long enough for the heaviest service writes (full analysis rebuild)
const REQUEST_TIMEOUT = 5 * 60 * 1000;

export const api = createApiClient({
  baseURL: env.API_URL,
  apiSecret: env.API_SECRET_KEY,
  serviceKey: env.API_SERVICE_KEY,
  timeout: REQUEST_TIMEOUT,
  onError: logError
});

export const webClient = axios.create({
  baseURL: env.WEB_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    Authorization: `Bearer ${env.WEBHOOK_SECRET_KEY}`
  }
});
