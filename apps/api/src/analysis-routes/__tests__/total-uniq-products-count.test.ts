import { expect, test, describe, mock, beforeEach } from "bun:test";

import totalUniqProductsCountHandler from "../total-uniq-products-count";

import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const cacheGet = mock(async () => null as unknown);
const cacheAdd = mock(async () => {});
const aggregate = mock(async () => [] as unknown);

const AnalysisData = { aggregate };

mock.module("@src/cache", () => ({
  cacheGet,
  cacheAdd
}));

mock.module("@src/db/models/analysis-data", () => ({
  AnalysisData
}));

describe("totalUniqProductsCountHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const next = mock(() => {}) as unknown as NextFunction;
  const json = mock(() => res as Response);
  const send = mock(() => res as Response);
  const status = mock(() => res as Response);

  beforeEach(() => {
    req = { query: {} };
    res = { json, send, status };
    cacheGet.mockReset();
    cacheAdd.mockReset();
    aggregate.mockClear();
    (next as unknown as Mock<NextFunction>).mockClear();
  });

  test("should return 400 if city is not provided", async () => {
    await totalUniqProductsCountHandler(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    cacheGet.mockResolvedValueOnce(123);

    await totalUniqProductsCountHandler(req as Request, res as Response, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:uniq-count:TestCity");
    expect(res.send).toHaveBeenCalledWith(123);
    expect(aggregate).not.toHaveBeenCalled();
  });

  test("should calculate unique count, cache it, and return it", async () => {
    req.query = { city: "TestCityVal" };
    const mockData = [{ uniqueCount: 2 }];
    aggregate.mockResolvedValueOnce(mockData);

    await totalUniqProductsCountHandler(req as Request, res as Response, next);

    expect(aggregate).toHaveBeenCalledWith([
      { $match: { city: "TestCityVal" } },
      { $group: { _id: "$link" } },
      { $count: "uniqueCount" }
    ]);
    expect(cacheAdd).toHaveBeenCalledWith(
      "daily:analysis:uniq-count:TestCityVal",
      2,
      expect.any(Object)
    );
    expect(res.send).toHaveBeenCalledWith(2);
  });

  test("should return 0 if db returns an empty array", async () => {
    req.query = { city: "TestCity" };
    aggregate.mockResolvedValueOnce([]);

    await totalUniqProductsCountHandler(req as Request, res as Response, next);

    expect(res.send).toHaveBeenCalledWith(0);
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:uniq-count:TestCity", 0, {
      ex: 60 * 60 * 24
    });
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    aggregate.mockRejectedValueOnce(error);

    await totalUniqProductsCountHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
