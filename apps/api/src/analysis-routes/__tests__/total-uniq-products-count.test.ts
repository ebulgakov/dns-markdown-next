import { createExpressMocks } from "@dns-markdown/tests/express";
import { cacheAdd, cacheGet, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import totalUniqProductsCountHandler from "../total-uniq-products-count";

// Mock dependencies
const aggregate = mock(async () => [] as unknown);

mock.module("@src/db/models/analysis-data", () => ({ AnalysisData: { aggregate } }));

const { req, res, next, json, send, status, reset } = createExpressMocks();

describe("totalUniqProductsCountHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    aggregate.mockClear();
  });

  test("should return 400 if city is not provided", async () => {
    await totalUniqProductsCountHandler(req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    cacheGet.mockResolvedValueOnce(123);

    await totalUniqProductsCountHandler(req, res, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:uniq-count:TestCity");
    expect(send).toHaveBeenCalledWith(123);
    expect(aggregate).not.toHaveBeenCalled();
  });

  test("should calculate unique count, cache it, and return it", async () => {
    req.query = { city: "TestCityVal" };
    const mockData = [{ uniqueCount: 2 }];
    aggregate.mockResolvedValueOnce(mockData);

    await totalUniqProductsCountHandler(req, res, next);

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
    expect(send).toHaveBeenCalledWith(2);
  });

  test("should return 0 if db returns an empty array", async () => {
    req.query = { city: "TestCity" };
    aggregate.mockResolvedValueOnce([]);

    await totalUniqProductsCountHandler(req, res, next);

    expect(send).toHaveBeenCalledWith(0);
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:uniq-count:TestCity", 0, {
      ex: 60 * 60 * 24
    });
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    aggregate.mockRejectedValueOnce(error);

    await totalUniqProductsCountHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
