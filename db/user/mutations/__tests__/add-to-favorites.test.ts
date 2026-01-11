import { dbConnect } from "@/db/database";
import { mockUser } from "@/db/user/__mocks__/user";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

import { addToFavorites } from "../add-to-favorites";

import type { Goods } from "@/types/pricelist";

// Mock the modules
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/user/queries", () => ({
  getUser: jest.fn()
}));

jest.mock("@/db/user/mutations/update-user", () => ({
  updateUser: jest.fn()
}));

describe("addToFavorites", () => {
  // Define mock data for Goods and User
  const mockGoods: Goods = {
    _id: "1",
    city: "Test City",
    link: "http://test.com/product/1",
    title: "",
    description: "",
    reasons: [],
    priceOld: "",
    price: "",
    profit: "",
    code: "",
    image: "",
    available: ""
  };

  // Clear all mocks before each test to ensure test isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a product to favorites when a user is found", async () => {
    // Arrange: Mock getUser to return a user
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    // Act: Call the function to test
    await addToFavorites(mockGoods);

    // Assert: Check if the functions were called as expected
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    // Check if updateUser was called with the correct payload
    expect(updateUser).toHaveBeenCalledWith({
      favorites: [
        ...mockUser.favorites,
        {
          status: {
            city: mockGoods.city,
            deleted: false,
            createdAt: expect.any(Date) // createdAt is a new Date()
          },
          item: mockGoods
        }
      ]
    });
  });

  it("should not call updateUser if no user is found", async () => {
    // Arrange: Mock getUser to return null
    (getUser as jest.Mock).mockResolvedValue(null);

    // Act: Call the function to test
    await expect(addToFavorites(mockGoods)).rejects.toThrow(
      "Cannot read properties of null (reading 'favorites')"
    );

    // Assert: Check that updateUser was not called
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("should throw an error if no goods are provided", async () => {
    // Act & Assert
    await expect(addToFavorites(null as never)).rejects.toThrow("No goods provided");

    // Assert that other functions were not called
    expect(dbConnect).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});
