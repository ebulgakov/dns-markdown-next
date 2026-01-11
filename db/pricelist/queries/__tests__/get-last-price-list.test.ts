import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";
import { getUser } from "@/db/user/queries";

import { getLastPriceList } from "../get-last-price-list";

import type { PriceList as PriceListType } from "@/types/pricelist";
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

jest.mock("@/db/models/pricelist-model", () => ({
  Pricelist: {
    findOne: jest.fn()
  }
}));

const mockedDbConnect = dbConnect as jest.Mock;
const mockedGetUser = getUser as jest.Mock;
const mockedFindOne = Pricelist.findOne as jest.Mock;

describe("getLastPriceList", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return error if user is not found", async () => {
    // Mock getUser to return null
    mockedGetUser.mockResolvedValue(null);

    await expect(getLastPriceList("TestCity")).rejects.toThrow("Price list not found");

    // Expect dbConnect to have been called
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(mockedGetUser).toHaveBeenCalledTimes(0);
    // Expect findOne not to have been called
    expect(mockedFindOne).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { updatedAt: -1 } }
    );
  });

  it("should return the last price list for the user's city", async () => {
    // Mock user data
    const mockUser: Partial<User> = {
      city: "Test City"
    };

    // Mock pricelist data
    const mockPriceList: Partial<PriceListType> = {
      _id: "some-id",
      city: "TestCity"
    };

    // Mock getUser to return a user
    mockedGetUser.mockResolvedValue(mockUser);
    // Mock findOne to return a pricelist
    mockedFindOne.mockResolvedValue(mockPriceList);

    const result = await getLastPriceList(mockPriceList.city!);

    // Expect dbConnect to have been called
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(mockedGetUser).toHaveBeenCalledTimes(0);
    // Expect findOne to have been called with correct parameters
    expect(mockedFindOne).toHaveBeenCalledWith(
      { city: mockPriceList.city },
      {},
      { sort: { updatedAt: -1 } }
    );
    // Expect result to be the mock pricelist
    expect(result).toEqual(mockPriceList);
  });

  it("should return null if no price list is found for the user's city", async () => {
    // Mock user data
    const mockUser: Partial<User> = {
      city: "Test City"
    };

    // Mock getUser to return a user
    mockedGetUser.mockResolvedValue(mockUser);
    // Mock findOne to return null
    mockedFindOne.mockResolvedValue(null);

    await expect(getLastPriceList("TestCity")).rejects.toThrow("Price list not found");

    // Expect dbConnect to have been called
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(mockedGetUser).toHaveBeenCalledTimes(0);
    // Expect findOne to have been called
    expect(mockedFindOne).toHaveBeenCalledTimes(1);
  });
});
