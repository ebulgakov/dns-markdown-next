import { createExpressMocks } from "@dns-markdown/tests/express";
import { cacheDelete, resetCache } from "@src/__tests__/setup";
import { expect, test, describe, mock, beforeEach } from "bun:test";

import deleteOldPriceListsHandler from "../delete-old-price-lists";

// Mock dependencies
const findExec = mock(async (): Promise<{ _id: string }[]> => []);
const find = mock(() => ({
  lean: () => ({ exec: findExec })
}));
const deleteManyExec = mock(async () => ({ deletedCount: 0 }));
const deleteMany = mock(() => ({ exec: deleteManyExec }));

mock.module("@src/db/models/pricelist", () => ({
  Pricelist: { find, deleteMany }
}));

const { req, res, next, json, status, reset } = createExpressMocks();

describe("deleteOldPriceListsHandler", () => {
  beforeEach(() => {
    reset();
    resetCache();
    findExec.mockReset();
    find.mockClear();
    deleteManyExec.mockReset();
    deleteMany.mockClear();
  });

  test("should return 400 if city is not provided", async () => {
    await deleteOldPriceListsHandler(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: expect.any(String) });
    expect(find).not.toHaveBeenCalled();
  });

  test("should delete nothing if there are no price lists beyond the last 30", async () => {
    req.body = { city: "TestCity" };
    findExec.mockResolvedValueOnce([]);

    await deleteOldPriceListsHandler(req, res, next);

    expect(find).toHaveBeenCalledWith(
      { city: "TestCity" },
      { _id: 1 },
      { sort: { updatedAt: -1, _id: -1 }, skip: 30 }
    );
    expect(deleteMany).not.toHaveBeenCalled();
    expect(cacheDelete).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({ deletedCount: 0 });
  });

  test("should delete old price lists by id and invalidate related cache", async () => {
    req.body = { city: "TestCity" };
    findExec.mockResolvedValueOnce([{ _id: "id-1" }, { _id: "id-2" }]);
    deleteManyExec.mockResolvedValueOnce({ deletedCount: 2 });

    await deleteOldPriceListsHandler(req, res, next);

    expect(deleteMany).toHaveBeenCalledWith({ _id: { $in: ["id-1", "id-2"] } });
    expect(cacheDelete).toHaveBeenCalledTimes(3);
    expect(cacheDelete).toHaveBeenCalledWith("daily:archive:list:TestCity");
    expect(cacheDelete).toHaveBeenCalledWith("archive:item:id-1");
    expect(cacheDelete).toHaveBeenCalledWith("archive:item:id-2");
    expect(json).toHaveBeenCalledWith({ deletedCount: 2 });
  });

  test("should still respond if cache invalidation fails", async () => {
    req.body = { city: "TestCity" };
    findExec.mockResolvedValueOnce([{ _id: "id-1" }]);
    deleteManyExec.mockResolvedValueOnce({ deletedCount: 1 });
    cacheDelete.mockRejectedValue(new Error("Redis error"));

    await deleteOldPriceListsHandler(req, res, next);

    expect(json).toHaveBeenCalledWith({ deletedCount: 1 });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next with error if deletion fails", async () => {
    req.body = { city: "TestCity" };
    const error = new Error("DB error");
    findExec.mockResolvedValueOnce([{ _id: "id-1" }]);
    deleteManyExec.mockRejectedValueOnce(error);

    await deleteOldPriceListsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
