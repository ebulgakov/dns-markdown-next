import { dbConnect } from "@/db/database";
import { Diff } from "@/db/models/diff-model";
import { RemovedGoods } from "@/db/models/mutated-goods-model";
import { getUser } from "@/db/user/queries";

import { getPriceListsDiff } from "../get-price-lists-diff";

import type { Diff as DiffType } from "@/types/diff";
import type { RemovedGoods as RemovedGoodsType } from "@/types/pricelist";
import type { User } from "@/types/user";

// Mock dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/user/queries", () => ({
  getUser: jest.fn()
}));

jest.mock("@/cache", () => ({
  get: jest.fn(),
  set: jest.fn()
}));

jest.mock("@/db/models/mutated-goods-model", () => ({
  RemovedGoods: { findOne: jest.fn() },
  NewGoods: { findOne: jest.fn() }
}));

jest.mock("@/db/models/diff-model", () => ({
  Diff: { findOne: jest.fn() }
}));

const mockedGetUser = jest.mocked(getUser);
const mockedRemovedGoodsFindOne = jest.mocked(RemovedGoods.findOne);
const mockedDiffFindOne = jest.mocked(Diff.findOne);

describe("getPriceListsDiff", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return null if user is not found", async () => {
    // @ts-expect-error -- mocking partials
    mockedGetUser.mockResolvedValue(null);

    const result = await getPriceListsDiff("TestCity");

    expect(result).toEqual({ diff: undefined, new: undefined, sold: undefined });
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).not.toHaveBeenCalled();
    expect(mockedRemovedGoodsFindOne).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { updatedAt: -1 } }
    );
    expect(mockedDiffFindOne).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { updatedAt: -1 } }
    );
  });

  test("should return null for diff and sold if no documents are found", async () => {
    const mockUser: Partial<User> = { city: "TestCity" };
    // @ts-expect-error -- mocking partials
    mockedGetUser.mockResolvedValue(mockUser);
    mockedRemovedGoodsFindOne.mockResolvedValue(null);
    mockedDiffFindOne.mockResolvedValue(null);

    const result = await getPriceListsDiff(mockUser.city!);

    expect(result).toEqual({ diff: undefined, new: undefined, sold: undefined });
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).not.toHaveBeenCalled();
    expect(mockedRemovedGoodsFindOne).toHaveBeenCalledWith(
      { city: mockUser.city },
      {},
      { sort: { updatedAt: -1 } }
    );
    expect(mockedDiffFindOne).toHaveBeenCalledWith(
      { city: mockUser.city },
      {},
      { sort: { updatedAt: -1 } }
    );
  });

  test("should return diff and sold data when documents are found", async () => {
    const mockUser: Partial<User> = { city: "TestCity" };
    const mockSoldData: Partial<RemovedGoodsType> = { goods: [] };
    const mockDiffData: Partial<DiffType> = { changesPrice: [] };

    // @ts-expect-error -- mocking partials
    mockedGetUser.mockResolvedValue(mockUser);
    mockedRemovedGoodsFindOne.mockResolvedValue(mockSoldData);
    mockedDiffFindOne.mockResolvedValue(mockDiffData);

    const result = await getPriceListsDiff(mockUser.city!);

    expect(result).toEqual({ diff: mockDiffData, sold: mockSoldData });
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).not.toHaveBeenCalled();
    expect(mockedRemovedGoodsFindOne).toHaveBeenCalledWith(
      { city: mockUser.city },
      {},
      { sort: { updatedAt: -1 } }
    );
    expect(mockedDiffFindOne).toHaveBeenCalledWith(
      { city: mockUser.city },
      {},
      { sort: { updatedAt: -1 } }
    );
  });
});
