import { expect, test, describe, mock, beforeEach } from "bun:test";

import lastAnalysisDiffHandler from "../last-diff";

import type { AnalysisDiff as AnalysisDiffType } from "@dns-markdown/db/types/analysis-diff";
import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const cacheGet = mock(async (): Promise<AnalysisDiffType | null> => null);
const cacheAdd = mock(async () => {});
const exec = mock(async (): Promise<AnalysisDiffType | null> => null);
const lean = mock(() => ({ exec }));
const findOne = mock(() => ({ lean }));

const AnalysisDiff = { findOne };

mock.module("@src/cache", () => ({
  cacheGet,
  cacheAdd
}));

mock.module("@dns-markdown/db/models/analysis-diff", () => ({
  AnalysisDiff
}));

describe("lastAnalysisDiffHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const next: NextFunction = mock(() => {});
  const json = mock(() => res as Response);
  const send = mock(() => res as Response);
  const status = mock(() => res as Response);

  beforeEach(() => {
    req = { query: {} };
    res = { json, send, status };
    cacheGet.mockReset();
    cacheAdd.mockReset();
    findOne.mockClear();
    lean.mockClear();
    exec.mockClear();
    (next as unknown as Mock<NextFunction>).mockClear();
    json.mockClear();
    send.mockClear();
    status.mockClear();
  });

  test("should return 400 if city is not provided", async () => {
    await lastAnalysisDiffHandler(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockDiff: AnalysisDiffType = {
      city: "TestCity",
      dateAdded: `${new Date()}`,
      newItems: [],
      removedItems: [],
      changesPrice: [],
      changesProfit: []
    };
    cacheGet.mockResolvedValueOnce(mockDiff);

    await lastAnalysisDiffHandler(req as Request, res as Response, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:last:TestCity");
    expect(json).toHaveBeenCalledWith(mockDiff);
    expect(findOne).not.toHaveBeenCalled();
  });

  test("should return 404 if no diff found in db", async () => {
    req.query = { city: "TestCity" };
    exec.mockResolvedValueOnce(null);

    await lastAnalysisDiffHandler(req as Request, res as Response, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith("Analysis diff not found");
  });

  test("should fetch from db, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const mockDiff: AnalysisDiffType = {
      city: "TestCity",
      dateAdded: "",
      newItems: [],
      removedItems: [],
      changesPrice: [],
      changesProfit: []
    };
    exec.mockResolvedValueOnce(mockDiff);

    await lastAnalysisDiffHandler(req as Request, res as Response, next);

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

    await lastAnalysisDiffHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
