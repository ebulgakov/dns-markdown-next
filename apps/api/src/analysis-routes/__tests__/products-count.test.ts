import { expect, test, describe, mock, beforeEach } from "bun:test";

import productsCountHandler from "../products-count";

import type {
  PriceList as PriceListType,
  PriceListsArchiveCount
} from "@dns-markdown/db/types/pricelist";
import type { Mock } from "bun:test";
import type { NextFunction, Request, Response } from "express";

// Mock dependencies
const cacheGet = mock(async (): Promise<PriceListsArchiveCount[] | null> => null);
const cacheAdd = mock(async () => {});
const exec = mock(async (): Promise<PriceListType[] | null> => null);
const lean = mock(() => ({ exec }));
const find = mock(() => ({ lean }));

const Pricelist = { find };

mock.module("@src/cache", () => ({
  cacheGet,
  cacheAdd
}));

mock.module("@dns-markdown/db/models/pricelist", () => ({
  Pricelist
}));

describe("productsCountHandler", () => {
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
    await productsCountHandler(req as Request, res as Response, next);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
  });

  test("should return cached data if it exists", async () => {
    req.query = { city: "TestCity" };
    const mockData: PriceListsArchiveCount[] = [{ date: `${new Date()}`, count: 100 }];
    cacheGet.mockResolvedValueOnce(mockData);

    await productsCountHandler(req as Request, res as Response, next);

    expect(cacheGet).toHaveBeenCalledWith("daily:analysis:products-count:TestCity");
    expect(json).toHaveBeenCalledWith(mockData);
    expect(find).not.toHaveBeenCalled();
  });

  test("should fetch from db, calculate counts, cache it, and return it", async () => {
    req.query = { city: "TestCity" };
    const date1 = new Date("2023-01-01T00:00:00.000Z");
    const date2 = new Date("2023-01-02T00:00:00.000Z");

    const mockPriceLists: PriceListType[] = [
      {
        _id: "2",
        city: "TestCity",
        createdAt: `${date2}`,
        positions: [
          {
            items: [1, 2, 3].map(() => ({
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
              available: ""
            })),
            _id: "",
            title: ""
          }
        ]
      },
      {
        _id: "1",
        city: "TestCity",
        createdAt: `${date1}`,
        positions: [
          {
            items: [1, 2, 3, 4].map(() => ({
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
              available: ""
            })),
            _id: "",
            title: ""
          }
        ]
      }
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

    await productsCountHandler(req as Request, res as Response, next);

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

    await productsCountHandler(req as Request, res as Response, next);

    expect(json).toHaveBeenCalledWith([]);
    expect(cacheAdd).toHaveBeenCalledWith("daily:analysis:products-count:TestCity", [], {
      ex: 60 * 60 * 24
    });
  });

  test("should call next with error if db query fails", async () => {
    req.query = { city: "TestCity" };
    const error = new Error("DB error");
    exec.mockRejectedValueOnce(error);

    await productsCountHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
