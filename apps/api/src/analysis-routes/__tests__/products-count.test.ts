import { createExpressMocks, mockQuery } from "@dns-markdown/tests/express";
import { makeGoods, makePriceList } from "@dns-markdown/tests/fixtures";
import { cacheAdd, cacheGet, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import productsCountHandler from "../products-count";

import type {
  PriceList as PriceListType,
  PriceListsArchiveCount
} from "@dns-markdown/types/pricelist";

const findQuery = mockQuery<PriceListType[] | null>(null);
const { query: find, lean, exec } = findQuery;

mock.module("@src/db/models/pricelist", () => ({ Pricelist: { find } }));

const { req, res, next, json, status, reset } = createExpressMocks();

describe("productsCountHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    findQuery.reset();
  });

  test("should return 400 if city is not provided", async () => {
    await productsCountHandler(req, res, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockData: PriceListsArchiveCount[] = [{ date: `${new Date()}`, count: 100 }];
    cacheGet.mockResolvedValueOnce(mockData);

    await productsCountHandler(req, res, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:products-count:TestCity");
    expect(json).toHaveBeenCalledWith(mockData);
    expect(find).not.toHaveBeenCalled();
  });

  test("should fetch from db, calculate counts, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const date1 = new Date("2023-01-01T00:00:00.000Z");
    const date2 = new Date("2023-01-02T00:00:00.000Z");

    const mockPriceLists = [
      makePriceList({
        _id: "2",
        city: "TestCity",
        createdAt: `${date2}`,
        positions: [{ _id: "", title: "", items: [1, 2, 3].map(() => makeGoods()) }]
      }),
      makePriceList({
        _id: "1",
        city: "TestCity",
        createdAt: `${date1}`,
        positions: [{ _id: "", title: "", items: [1, 2, 3, 4].map(() => makeGoods()) }]
      })
    ];
    exec.mockResolvedValueOnce(mockPriceLists);

    const expectedResult: PriceListsArchiveCount[] = [
      {
        count: 4,
        date: `${date1}` // earliest date
      },
      {
        count: 3,
        date: `${date2}` // later date
      }
    ];

    await productsCountHandler(req, res, next);

    expect(find).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { updatedAt: -1 }, limit: 30 }
    );
    expect(lean).toHaveBeenCalled();
    expect(exec).toHaveBeenCalled();
    expect(cacheAdd).toHaveBeenCalledWith(
      "daily:analysis:products-count:TestCity",
      expectedResult,
      {
        ex: 60 * 60 * 24
      }
    );
    expect(json).toHaveBeenCalledWith(expectedResult);
  });

  test("should return an empty array if db returns an empty array", async () => {
    req.query = { city: "TestCity" };
    exec.mockResolvedValueOnce([]);

    await productsCountHandler(req, res, next);

    expect(json).toHaveBeenCalledWith([]);
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:products-count:TestCity", [], {
      ex: 60 * 60 * 24
    });
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await productsCountHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
