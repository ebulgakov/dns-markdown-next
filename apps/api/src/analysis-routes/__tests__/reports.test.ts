import { expect, test, describe, mock, beforeEach } from "bun:test";

import reportsHandler from "../reports";

import type { ReportsResponse } from "@dns-markdown/types/reports";
import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const cacheGet = mock(async (): Promise<ReportsResponse | null> => null);
const cacheAdd = mock(async () => {});
const exec = mock(async (): Promise<ReportsResponse | null> => null);
const lean = mock(() => ({ exec }));
const find = mock(() => ({ lean }));

const Reports = { find };

mock.module("@src/cache", () => ({
  cacheGet,
  cacheAdd
}));

mock.module("@src/db/models/reports", () => ({
  Reports
}));

describe("reportsHandler", () => {
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
    await reportsHandler(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockReports: ReportsResponse = [];
    cacheGet.mockResolvedValueOnce(mockReports);

    await reportsHandler(req as Request, res as Response, next);

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

    await reportsHandler(req as Request, res as Response, next);

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

    await reportsHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
