import axios from "axios";

import { env } from "#env.ts";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "X-Internal-API-Secret": env.API_SECRET_KEY,
    Authorization: `Bearer ${env.API_SERVICE_KEY}`
  }
});

export const webClient = axios.create({
  baseURL: env.WEB_URL,
  headers: {
    Authorization: `Bearer ${env.WEBHOOK_SECRET_KEY}`
  }
});
