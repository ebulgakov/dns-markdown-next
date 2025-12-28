import { getLastPriceList } from "../get-last-price-list";
import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { HourlyPricelist } from "@/db/models/pricelist_model";
import type { PriceList as PriceListType } from "@/types/pricelist";
import type { User } from "@/types/user";

// Mock dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/profile/queries", () => ({
  getUser: jest.fn()
}));

jest.mock("@/db/models/pricelist_model", () => ({
  HourlyPricelist: {
    findOne: jest.fn()
  }
}));

const mockedDbConnect = dbConnect as jest.Mock;
const mockedGetUser = getUser as jest.Mock;
const mockedFindOne = HourlyPricelist.findOne as jest.Mock;

describe("getLastPriceList", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return null if user is not found", async () => {
    // Mock getUser to return null
    mockedGetUser.mockResolvedValue(null);

    const result = await getLastPriceList();

    // Expect dbConnect to have been called
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
    // Expect findOne not to have been called
    expect(mockedFindOne).not.toHaveBeenCalled();
    // Expect result to be null
    expect(result).toBeNull();
  });

  it("should return the last price list for the user's city", async () => {
    // Mock user data
    const mockUser: Partial<User> = {
      city: "Test City"
    };

    // Mock pricelist data
    const mockPriceList: Partial<PriceListType> = {
      id: "some-id",
      city: "Test City"
    };

    // Mock getUser to return a user
    mockedGetUser.mockResolvedValue(mockUser);
    // Mock findOne to return a pricelist
    mockedFindOne.mockResolvedValue(mockPriceList);

    const result = await getLastPriceList();

    // Expect dbConnect to have been called
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
    // Expect findOne to have been called with correct parameters
    expect(mockedFindOne).toHaveBeenCalledWith(
      { city: mockUser.city },
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

    const result = await getLastPriceList();

    // Expect dbConnect to have been called
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
    // Expect findOne to have been called
    expect(mockedFindOne).toHaveBeenCalledTimes(1);
    // Expect result to be null
    expect(result).toBeNull();
  });
});
