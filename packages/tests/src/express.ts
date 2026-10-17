import { mock } from "bun:test";

import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Request/response doubles for calling an Express handler directly:
// `await handler(req, res, next)`. `json`, `send` and `status` return `res`, so chained
// `res.status(404).send(...)` works. Call `reset()` in beforeEach.
export const createExpressMocks = () => {
  const res = {} as Response;
  const json = mock(() => res);
  const send = mock(() => res);
  const status = mock(() => res);
  // NextFunction is overloaded, so a typed mock is not assignable to it directly.
  const next = mock(() => {}) as unknown as Mock<() => void> & NextFunction;
  Object.assign(res, { json, send, status });

  const req = {} as Request;

  return {
    req,
    res,
    next,
    json,
    send,
    status,
    // Clear calls and replace the request fields (query, body, header, ...).
    reset(request: Partial<Request> = {}) {
      for (const fn of [json, send, status, next]) fn.mockClear();
      for (const key of Object.keys(req)) delete (req as unknown as Record<string, unknown>)[key];
      Object.assign(req, { query: {}, body: {} }, request);
    }
  };
};

// Mongoose query chain double: `query(...)` returns a chain whose `sort` / `lean` return the
// same chain and `exec` resolves with `result`. Use `query` as a model method (find, findOne).
export const mockQuery = <T>(result: T) => {
  const exec = mock(async (): Promise<T> => result);
  const chain: { sort: unknown; lean: unknown; exec: typeof exec } = {
    sort: null,
    lean: null,
    exec
  };
  const sort = mock(() => chain);
  const lean = mock(() => chain);
  Object.assign(chain, { sort, lean });
  const query = mock<(...args: unknown[]) => typeof chain>(() => chain);

  return {
    query,
    sort,
    lean,
    exec,
    reset() {
      for (const fn of [query, sort, lean]) fn.mockClear();
      exec.mockReset();
      exec.mockImplementation(async () => result);
    }
  };
};
