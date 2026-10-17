import { createExpressMocks, mockQuery } from "@dns-markdown/tests/express";
import { cacheAdd, cacheGet, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import reportsHandler from "../reports";

import type { ReportsResponse } from "@dns-markdown/types/reports";

const findQuery = mockQuery<ReportsResponse | null>(null);
const { query: find, lean, exec } = findQuery;

mock.module("@src/db/models/reports", () => ({ Reports: { find } }));

const { req, res, next, json, status, reset } = createExpressMocks();

describe("reportsHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    findQuery.reset();
  });

  test("should return 400 if city is not provided", async () => {
    await reportsHandler(req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockReports: ReportsResponse = [];
    cacheGet.mockResolvedValueOnce(mockReports);

    await reportsHandler(req, res, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:reports:TestCity");
    expect(json).toHaveBeenCalledWith(mockReports);
    expect(find).not.toHaveBeenCalled();
  });

  test("should fetch from db, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const mockReports: ReportsResponse = [
      {
        _id: "",
        city: "TestCity",
        dateAdded: "",
        report: ""
      }
    ];
    exec.mockResolvedValueOnce(mockReports);

    await reportsHandler(req, res, next);

    expect(find).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { dateAdded: -1 }, limit: 30 }
    );
    expect(lean).toHaveBeenCalled();
    expect(exec).toHaveBeenCalled();
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:reports:TestCity", mockReports, {
      ex: 60 * 60 * 24
    });
    expect(json).toHaveBeenCalledWith(mockReports);
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await reportsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
