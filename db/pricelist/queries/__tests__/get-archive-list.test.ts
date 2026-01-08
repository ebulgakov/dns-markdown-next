import { getArchiveList } from "../get-archive-list";
import { dbConnect } from "@/db/database";
import { getUser } from "@/db/user/queries";
import { Pricelist } from "@/db/models/pricelist-model";
import type { User } from "@/types/user";

// Mock dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/user/queries", () => ({
  getUser: jest.fn()
}));

jest.mock("@/db/models/pricelist-model", () => ({
  Pricelist: {
    find: jest.fn()
  }
}));

describe("getArchiveList", () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for when the user is not found
  it("should return null if user is not found", async () => {
    // Mock getUser to return null
    (getUser as jest.Mock).mockResolvedValue(null);

    await expect(getArchiveList()).rejects.toThrow("User not found");

    // Assertions
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(Pricelist.find).not.toHaveBeenCalled();
  });

  // Test case for when a valid user is found
  it("should return a list of pricelists for a valid user", async () => {
    // Mock user data
    const mockUser: Partial<User> = {
      city: "TestCity"
    };

    // Mock pricelist data
    const mockPriceLists = [
      { createdAt: new Date("2023-01-01") },
      { createdAt: new Date("2023-01-02") }
    ];

    // Mock getUser to return a user
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    // Mock the chain of Mongoose calls: find().select()
    const selectMock = jest.fn().mockResolvedValue(mockPriceLists);
    const findMock = {
      select: selectMock
    };
    (Pricelist.find as jest.Mock).mockReturnValue(findMock);

    const result = await getArchiveList();

    // Assertions
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(Pricelist.find).toHaveBeenCalledWith(
      { city: mockUser.city },
      {},
      { sort: { updatedAt: 1 } }
    );
    expect(selectMock).toHaveBeenCalledWith("createdAt");
    expect(result).toEqual(mockPriceLists);
  });

  // Test case for when no pricelists are found for the user's city
  it("should return an empty array if no pricelists are found", async () => {
    // Mock user data
    const mockUser: Partial<User> = {
      city: "TestCity"
    };

    // Mock getUser to return a user
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    // Mock the chain of Mongoose calls to return an empty array
    const selectMock = jest.fn().mockResolvedValue([]);
    const findMock = {
      select: selectMock
    };
    (Pricelist.find as jest.Mock).mockReturnValue(findMock);

    const result = await getArchiveList();

    // Assertions
    expect(result).toEqual([]);
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(Pricelist.find).toHaveBeenCalledWith(
      { city: mockUser.city },
      {},
      { sort: { updatedAt: 1 } }
    );
  });
});
