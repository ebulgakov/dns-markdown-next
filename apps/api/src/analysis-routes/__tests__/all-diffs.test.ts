import { expect, test, describe, mock, beforeEach } from "bun:test";

import allAnalysisDiffsHandler from "../all-diffs";

import type {
  AnalysisDiff as AnalysisDiffType,
  AnalysisDiffReport
} from "@dns-markdown/db/types/analysis-diff";
import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const cacheGet = mock(async (): Promise<AnalysisDiffReport[] | null> => null);
const cacheAdd = mock(async () => {});
const exec = mock(async (): Promise<AnalysisDiffType[] | null> => null);
const lean = mock(() => ({ exec }));
const find = mock(() => ({ lean }));

const AnalysisDiff = { find };

mock.module("@src/cache", () => ({
  cacheGet,
  cacheAdd
}));

mock.module("@dns-markdown/db/models/analysis-diff", () => ({
  AnalysisDiff
}));

describe("allAnalysisDiffsHandler", () => {
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
    find.mockClear();
    lean.mockClear();
    exec.mockClear();
    (next as unknown as Mock<NextFunction>).mockClear();
    json.mockClear();
    send.mockClear();
    status.mockClear();
  });

  test("should return 400 if city is not provided", async () => {
    await allAnalysisDiffsHandler(req as Request, res as Response, next);
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

    await allAnalysisDiffsHandler(req as Request, res as Response, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:all:TestCity");
    expect(json).toHaveBeenCalledWith(mockReport);
    expect(find).not.toHaveBeenCalled();
  });

  test("should fetch from db, transform it, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const date = `${new Date()}`;
    const mockDiffs: AnalysisDiffType[] = [
      {
        city: "TestCity",
        dateAdded: date,
        newItems: [1, 2].map(() => ({
          _id: "",
          title: "",
          link: "",
          description: "",
          reasons: [],
          priceOld: "",
          price: "",
          profit: "",
          code: "",
          image: "",
          available: "",
          city: "",
          category: "",
          dateAdded: ""
        })),
        removedItems: [1].map(() => ({
          _id: "",
          title: "",
          link: "",
          description: "",
          reasons: [],
          priceOld: "",
          price: "",
          profit: "",
          code: "",
          image: "",
          available: "",
          city: "",
          category: "",
          dateAdded: ""
        })),
        changesPrice: [1, 2, 3].map(() => ({
          diff: {
            priceOld: "",
            price: "",
            profit: ""
          },
          item: {
            _id: "",
            title: "",
            link: "",
            description: "",
            reasons: [],
            priceOld: "",
            price: "",
            profit: "",
            code: "",
            image: "",
            available: "",
            city: "",
            category: "",
            dateAdded: ""
          }
        })),
        changesProfit: []
      }
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

    await allAnalysisDiffsHandler(req as Request, res as Response, next);

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

    await allAnalysisDiffsHandler(req as Request, res as Response, next);

    expect(json).toHaveBeenCalledWith([]);
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:all:TestCity", [], {
      ex: 60 * 60 * 24
    });
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await allAnalysisDiffsHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
