import { env } from "@src/env";
import axios from "axios";

// Axios waits forever by default; long enough for the heaviest service writes (full analysis rebuild)
const REQUEST_TIMEOUT = 5 * 60 * 1000;

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "X-Internal-API-Secret": env.API_SECRET_KEY,
    Authorization: `Bearer ${env.API_SERVICE_KEY}`
  }
});

export const webClient = axios.create({
  baseURL: env.WEB_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    Authorization: `Bearer ${env.WEBHOOK_SECRET_KEY}`
  }
});
