import { createExpressMocks, mockQuery } from "@dns-markdown/tests/express";
import { makeAnalysisData, makeAnalysisDiff } from "@dns-markdown/tests/fixtures";
import { cacheAdd, cacheGet, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import allAnalysisDiffsHandler from "../all-diffs";

import type {
  AnalysisDiff as AnalysisDiffType,
  AnalysisDiffReport
} from "@dns-markdown/types/analysis-diff";

const findQuery = mockQuery<AnalysisDiffType[] | null>(null);
const { query: find, lean, exec } = findQuery;

mock.module("@src/db/models/analysis-diff", () => ({ AnalysisDiff: { find } }));

const { req, res, next, json, status, reset } = createExpressMocks();

describe("allAnalysisDiffsHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    findQuery.reset();
  });

  test("should return 400 if city is not provided", async () => {
    await allAnalysisDiffsHandler(req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockReport: AnalysisDiffReport[] = [
      {
        city: "TestCity",
        dateAdded: `${new Date()}`,
        newItems: 5,
        removedItems: 2,
        changesPrice: 1,
        changesProfit: 0
      }
    ];
    cacheGet.mockResolvedValueOnce(mockReport);

    await allAnalysisDiffsHandler(req, res, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:all:TestCity");
    expect(json).toHaveBeenCalledWith(mockReport);
    expect(find).not.toHaveBeenCalled();
  });

  test("should fetch from db, transform it, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const date = `${new Date()}`;
    const item = makeAnalysisData();
    const mockDiffs = [
      makeAnalysisDiff({
        city: "TestCity",
        dateAdded: date,
        newItems: [item, item],
        removedItems: [item],
        changesPrice: [1, 2, 3].map(() => ({ diff: { priceOld: "", price: "", profit: "" }, item }))
      })
    ];
    exec.mockResolvedValueOnce(mockDiffs);

    const expectedReport: AnalysisDiffReport[] = [
      {
        city: "TestCity",
        dateAdded: date,
        newItems: 2,
        removedItems: 1,
        changesPrice: 3,
        changesProfit: 0
      }
    ];

    await allAnalysisDiffsHandler(req, res, next);

    expect(find).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { dateAdded: -1 }, limit: 30 }
    );
    expect(lean).toHaveBeenCalled();
    expect(exec).toHaveBeenCalled();
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:all:TestCity", expectedReport, {
      ex: 60 * 60 * 24
    });
    expect(json).toHaveBeenCalledWith(expectedReport);
  });

  test("should return an empty array if no diffs are found in db", async () => {
    req.query = { city: "TestCity" };
    exec.mockResolvedValueOnce([]);

    await allAnalysisDiffsHandler(req, res, next);

    expect(json).toHaveBeenCalledWith([]);
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:all:TestCity", [], {
      ex: 60 * 60 * 24
    });
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await allAnalysisDiffsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
