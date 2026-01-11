import { dbConnect } from "@/db/database";
import { mockGoods } from "@/db/user/__mocks__/pricelist";
import { mockUser } from "@/db/user/__mocks__/user";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

import { addToFavorites } from "../add-to-favorites";

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a product to favorites when a user is found", async () => {
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    await addToFavorites(mockGoods);

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({
      favorites: [
        ...mockUser.favorites,
        {
          status: {
            city: mockGoods.city,
            deleted: false,
            createdAt: expect.any(Date)
          },
          item: mockGoods
        }
      ]
    });
  });

  it("should throw an error and not update if user is not found", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    await expect(addToFavorites(mockGoods)).rejects.toThrow(
      "Cannot read properties of null (reading 'favorites')"
    );

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("should throw an error if no goods are provided", async () => {
    await expect(addToFavorites(null as never)).rejects.toThrow("No goods provided");

    expect(dbConnect).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});
