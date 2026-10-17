import { createExpressMocks, mockQuery } from "@dns-markdown/tests/express";
import { makeAnalysisDiff } from "@dns-markdown/tests/fixtures";
import { cacheAdd, cacheGet, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import lastAnalysisDiffHandler from "../last-diff";

import type { AnalysisDiff as AnalysisDiffType } from "@dns-markdown/types/analysis-diff";

const findOneQuery = mockQuery<AnalysisDiffType | null>(null);
const { query: findOne, lean, exec } = findOneQuery;

mock.module("@src/db/models/analysis-diff", () => ({ AnalysisDiff: { findOne } }));

const { req, res, next, json, send, status, reset } = createExpressMocks();

describe("lastAnalysisDiffHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    findOneQuery.reset();
  });

  test("should return 400 if city is not provided", async () => {
    await lastAnalysisDiffHandler(req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockDiff = makeAnalysisDiff({ city: "TestCity" });
    cacheGet.mockResolvedValueOnce(mockDiff);

    await lastAnalysisDiffHandler(req, res, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:last:TestCity");
    expect(json).toHaveBeenCalledWith(mockDiff);
    expect(findOne).not.toHaveBeenCalled();
  });

  test("should return 404 if no diff found in db", async () => {
    req.query = { city: "TestCity" };
    exec.mockResolvedValueOnce(null);

    await lastAnalysisDiffHandler(req, res, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith("Analysis diff not found");
  });

  test("should fetch from db, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const mockDiff = makeAnalysisDiff({ city: "TestCity" });
    exec.mockResolvedValueOnce(mockDiff);

    await lastAnalysisDiffHandler(req, res, next);

    expect(findOne).toHaveBeenCalledWith({ city: "TestCity" }, {}, { sort: { dateAdded: -1 } });
    expect(lean).toHaveBeenCalled();
    expect(exec).toHaveBeenCalled();
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:last:TestCity", mockDiff, {
      ex: 60 * 60 * 24
    });
    expect(json).toHaveBeenCalledWith(mockDiff);
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await lastAnalysisDiffHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
