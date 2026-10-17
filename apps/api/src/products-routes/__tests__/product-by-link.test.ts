import { createExpressMocks, mockQuery } from "@dns-markdown/tests/express";
import { makeAnalysisData } from "@dns-markdown/tests/fixtures";
import { cacheAdd, cacheGet, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import productByLinkHandler from "../product-by-link";

import type { AnalysisData as AnalysisDataType } from "@dns-markdown/types/analysis-data";
import type { Goods } from "@dns-markdown/types/pricelist";
import type { ProductPayload } from "@dns-markdown/types/product";

// Mock dependencies
const findQuery = mockQuery<AnalysisDataType[]>([]);
const { query: find, sort, exec } = findQuery;
const getLastPriceListFlat = mock(async (): Promise<Goods[]> => []);

mock.module("@src/db/models/analysis-data", () => ({ AnalysisData: { find } }));

mock.module("@src/pricelist-routes/helpers/get-last-price-list", () => ({
  getLastPriceListFlat
}));

const makeEntry = (overrides: Partial<AnalysisDataType> = {}) =>
  makeAnalysisData({ link: "https://example.com/product", city: "TestCity", ...overrides });

const { req, res, next, json, send, status, reset } = createExpressMocks();

describe("productByLinkHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    findQuery.reset();
    getLastPriceListFlat.mockReset();
  });

  test("should return 400 if link is not provided", async () => {
    await productByLinkHandler(req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { link: "https://example.com/product" };
    const mockPayload = {
      item: makeEntry(),
      history: [],
      status: { createdAt: "", updatedAt: "", deleted: false, city: "TestCity" }
    } as ProductPayload;
    cacheGet.mockResolvedValueOnce(mockPayload);

    await productByLinkHandler(req, res, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:products:link:https://example.com/product");
    expect(json).toHaveBeenCalledWith(mockPayload);
    expect(find).not.toHaveBeenCalled();
  });

  test("should return 404 if no history found for the link", async () => {
    req.query = { link: "https://example.com/product" };
    exec.mockResolvedValueOnce([]);

    await productByLinkHandler(req, res, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith("Product not found");
  });

  test("should query sorted by dateAdded ascending", async () => {
    req.query = { link: "https://example.com/product" };
    exec.mockResolvedValueOnce([makeEntry()]);
    getLastPriceListFlat.mockResolvedValueOnce([]);

    await productByLinkHandler(req, res, next);

    expect(find).toHaveBeenCalledWith({ link: "https://example.com/product" });
    expect(sort).toHaveBeenCalledWith({ dateAdded: 1 });
  });

  test("should build history, derive status from first/last entries, cache it, and return it", async () => {
    req.query = { link: "https://example.com/product" };
    const firstEntry = makeEntry({ dateAdded: "2024-01-01T00:00:00.000Z", price: "1000" });
    const lastEntry = makeEntry({ dateAdded: "2024-02-01T00:00:00.000Z", price: "800" });
    exec.mockResolvedValueOnce([firstEntry, lastEntry]);
    getLastPriceListFlat.mockResolvedValueOnce([{ link: "https://example.com/product" } as Goods]);

    await productByLinkHandler(req, res, next);

    expect(getLastPriceListFlat).toHaveBeenCalledWith("TestCity");

    const expectedPayload: ProductPayload = {
      item: { ...lastEntry, dateAdded: firstEntry.dateAdded },
      history: [
        {
          dateAdded: firstEntry.dateAdded,
          price: firstEntry.price,
          priceOld: firstEntry.priceOld,
          profit: firstEntry.profit
        },
        {
          dateAdded: lastEntry.dateAdded,
          price: lastEntry.price,
          priceOld: lastEntry.priceOld,
          profit: lastEntry.profit
        }
      ],
      status: {
        createdAt: firstEntry.dateAdded,
        updatedAt: lastEntry.dateAdded,
        deleted: false,
        city: "TestCity"
      }
    };

    expect(cacheAdd).toHaveBeenCalledWith(
      "daily:products:link:https://example.com/product",
      expectedPayload,
      { ex: 60 * 60 * 24 }
    );
    expect(json).toHaveBeenCalledWith(expectedPayload);
  });

  test("should mark status as deleted when the link is missing from the current catalog", async () => {
    req.query = { link: "https://example.com/product" };
    exec.mockResolvedValueOnce([makeEntry()]);
    getLastPriceListFlat.mockResolvedValueOnce([]);

    await productByLinkHandler(req, res, next);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ status: expect.objectContaining({ deleted: true }) })
    );
  });

  test("should call next with error if db query fails", async () => {
    req.query = { link: "https://example.com/product" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await productByLinkHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
