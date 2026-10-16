import { isAxiosError } from "axios";

// An AxiosError carries the request config, including the auth headers with the API keys, so
// only non-secret fields are logged
export default function describeError(error: unknown) {
  if (!isAxiosError(error)) return error;

  return {
    message: error.message,
    code: error.code,
    method: error.config?.method,
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data
  };
}
