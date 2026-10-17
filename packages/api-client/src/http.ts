import axios from "axios";

import type { AxiosInstance } from "axios";

export type HttpConfig = {
  baseURL: string;
  // X-Internal-API-Secret, required by /api/* routes
  apiSecret?: string;
  // Bearer token for /service/* routes
  serviceKey?: string;
  timeout?: number;
};

// Minimal transport the endpoints need: an axios instance fits, and so does a test mock
export type HttpLike = {
  get(url: string, config?: object): Promise<{ data: any }>; // eslint-disable-line @typescript-eslint/no-explicit-any
  post(url: string, data?: unknown, config?: object): Promise<{ data: any }>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const createHttpClient = ({
  baseURL,
  apiSecret,
  serviceKey,
  timeout
}: HttpConfig): AxiosInstance => {
  const headers: Record<string, string> = {};
  if (apiSecret) headers["X-Internal-API-Secret"] = apiSecret;
  if (serviceKey) headers.Authorization = `Bearer ${serviceKey}`;

  return axios.create({ baseURL, timeout, headers });
};
