import { expect, test, describe, mock, beforeEach } from "bun:test";

import lastPriceListHandler from "../last-pricelist";

import type { PriceList as PriceListType } from "@dns-markdown/db/types/pricelist";
import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const cacheGet = mock(async (): Promise<PriceListType | null> => null);
const cacheAdd = mock(async () => {});
const getLastPriceListWithDates = mock(async (): Promise<PriceListType | null> => null);

mock.module("@src/cache", () => ({
  cacheGet,
  cacheAdd
}));

mock.module("@src/pricelist-routes/helpers/get-last-price-list.ts", () => ({
  getLastPriceListWithDates
}));

describe("lastPriceListHandler", () => {
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
    getLastPriceListWithDates.mockReset();
    (next as unknown as Mock<NextFunction>).mockClear();
    json.mockClear();
    send.mockClear();
    status.mockClear();
  });

  test("should return 400 if city is not provided", async () => {
    await lastPriceListHandler(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockData = { _id: "1", city: "TestCity", createdAt: "", positions: [] } as PriceListType;
    cacheGet.mockResolvedValueOnce(mockData);

    await lastPriceListHandler(req as Request, res as Response, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:pricelist:last:TestCity");
    expect(json).toHaveBeenCalledWith(mockData);
    expect(getLastPriceListWithDates).not.toHaveBeenCalled();
  });

  test("should return 404 if price list not found", async () => {
    req.query = { city: "TestCity" };
    getLastPriceListWithDates.mockResolvedValueOnce(null);

    await lastPriceListHandler(req as Request, res as Response, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith("Price list not found");
  });

  test("should attach dateAdded per item, cache the result, and return it", async () => {
    req.query = { city: "TestCity" };
    const priceListWithDates: PriceListType = {
      _id: "1",
      city: "TestCity",
      createdAt: "2024-01-01T00:00:00.000Z",
      positions: [
        {
          _id: "p1",
          title: "Category",
          items: [
            {
              _id: "i1",
              title: "Item with history",
              link: "link-1",
              description: "",
              reasons: [],
              priceOld: "",
              price: "",
              profit: "",
              code: "",
              image: "",
              available: "",
              dateAdded: "2024-02-01T00:00:00.000Z"
            },
            {
              _id: "i2",
              title: "Item without history",
              link: "link-2",
              description: "",
              reasons: [],
              priceOld: "",
              price: "",
              profit: "",
              code: "",
              image: "",
              available: "",
              dateAdded: null
            }
          ]
        }
      ]
    };
    getLastPriceListWithDates.mockResolvedValueOnce(priceListWithDates);

    await lastPriceListHandler(req as Request, res as Response, next);

    expect(getLastPriceListWithDates).toHaveBeenCalledWith("TestCity");
    expect(cacheAdd).toHaveBeenCalledWith("daily:pricelist:last:TestCity", priceListWithDates, {
      ex: 60 * 60 * 24
    });
    expect(json).toHaveBeenCalledWith(priceListWithDates);
  });

  test("should call next with error if fetching fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    getLastPriceListWithDates.mockRejectedValueOnce(error);

    await lastPriceListHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
