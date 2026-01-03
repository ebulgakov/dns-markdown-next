import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { updateUser } from "@/db/profile/mutations/update-user";
import { removeFromFavorites } from "../remove-from-favorites";

// Mock the dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/profile/queries", () => ({
  getUser: jest.fn()
}));

jest.mock("@/db/profile/mutations/update-user", () => ({
  updateUser: jest.fn()
}));

describe("removeFromFavorites", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should remove an item from favorites", async () => {
    // Arrange
    const itemIdToRemove = "item2";
    const user = {
      favorites: [
        { item: { link: "item1" } },
        { item: { link: "item2" } },
        { item: { link: "item3" } }
      ]
    };
    (getUser as jest.Mock).mockResolvedValue(user);

    // Act
    await removeFromFavorites(itemIdToRemove);

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    const expectedFavorites = [{ item: { link: "item1" } }, { item: { link: "item3" } }];
    expect(updateUser).toHaveBeenCalledWith({ favorites: expectedFavorites });
  });

  it("should not call updateUser if user is not found", async () => {
    // Arrange
    (getUser as jest.Mock).mockResolvedValue(null);

    // Act
    await expect(removeFromFavorites("some-id")).rejects.toThrow("User not found");

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("should handle removing an item that is not in favorites", async () => {
    // Arrange
    const itemIdToRemove = "non-existent-item";
    const user = {
      favorites: [{ item: { link: "item1" } }, { item: { link: "item2" } }]
    };
    (getUser as jest.Mock).mockResolvedValue(user);

    // Act
    await removeFromFavorites(itemIdToRemove);

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    const expectedFavorites = [{ item: { link: "item1" } }, { item: { link: "item2" } }];
    expect(updateUser).toHaveBeenCalledWith({ favorites: expectedFavorites });
  });

  it("should throw an error if no link is provided", async () => {
    // Act & Assert
    await expect(removeFromFavorites(null as never)).rejects.toThrow("No link provided");

    // Assert that other functions were not called
    expect(dbConnect).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});
