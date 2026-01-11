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
  RemovedGoods: {
    findOne: jest.fn()
  },
  NewGoods: {
    findOne: jest.fn()
  }
}));

jest.mock("@/db/models/diff-model", () => ({
  Diff: {
    findOne: jest.fn()
  }
}));

// Create typed mocks
const mockedDbConnect = dbConnect as jest.Mock;
const mockedGetUser = getUser as jest.Mock;
const mockedRemovedGoodsFindOne = RemovedGoods.findOne as jest.Mock;
const mockedDiffFindOne = Diff.findOne as jest.Mock;

describe("getPriceListsDiff", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: User is not authenticated
  test("should return null if user is not found", async () => {
    // Arrange: Mock getUser to return null
    mockedGetUser.mockResolvedValue(null);

    // Act: Call the function
    const result = await getPriceListsDiff("TestCity");

    // Assert: Check the result and that functions were called correctly
    expect(result).toEqual({ diff: undefined, new: undefined, sold: undefined });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(0);
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

  // Test case: User is authenticated, but no diff or sold data is found
  test("should return null for diff and sold if no documents are found", async () => {
    // Arrange: Mock user and findOne calls to return null
    const mockUser: Partial<User> = { city: "TestCity" };
    mockedGetUser.mockResolvedValue(mockUser);
    mockedRemovedGoodsFindOne.mockResolvedValue(null);
    mockedDiffFindOne.mockResolvedValue(null);

    // Act: Call the function
    const result = await getPriceListsDiff(mockUser.city!);

    // Assert: Check that the result contains undefined and functions were called correctly
    expect(result).toEqual({ diff: undefined, new: undefined, sold: undefined });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(0);
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

  // Test case: User is authenticated, and data is found
  test("should return diff and sold data when documents are found", async () => {
    // Arrange: Mock user and findOne calls to return sample data
    const mockUser: Partial<User> = { city: "TestCity" };
    const mockSoldData: Partial<RemovedGoodsType> = { goods: [] };
    const mockDiffData: Partial<DiffType> = { changesPrice: [] };

    mockedGetUser.mockResolvedValue(mockUser);
    mockedRemovedGoodsFindOne.mockResolvedValue(mockSoldData);
    mockedDiffFindOne.mockResolvedValue(mockDiffData);

    // Act: Call the function
    const result = await getPriceListsDiff(mockUser.city!);

    // Assert: Check that the result contains the mocked data
    expect(result).toEqual({ diff: mockDiffData, sold: mockSoldData });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(0);
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
