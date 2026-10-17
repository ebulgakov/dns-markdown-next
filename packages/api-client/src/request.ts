import type { HttpLike } from "./http";

export type ErrorHandler = (endpoint: string, error: unknown) => void;

export type Request = {
  get<T>(endpoint: string, params?: object): Promise<T>;
  post<T>(endpoint: string, data?: object, token?: string): Promise<T>;
};

export const createRequest = (http: HttpLike, onError?: ErrorHandler): Request => {
  const run = async <T>(endpoint: string, call: () => Promise<{ data: T }>) => {
    try {
      const response = await call();
      return response.data;
    } catch (error) {
      onError?.(endpoint, error);
      throw error;
    }
  };

  return {
    get: (endpoint, params) => run(endpoint, () => http.get(endpoint, params ? { params } : {})),
    post: (endpoint, data = {}, token) =>
      run(endpoint, () =>
        token
          ? http.post(endpoint, data, { headers: { Authorization: `Bearer ${token}` } })
          : http.post(endpoint, data)
      )
  };
};
