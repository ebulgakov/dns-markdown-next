import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { updateUser } from "@/db/profile/mutations/update-user";
import { removeFromFavorites } from "../remove-from-favorites";

// Mock the dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn(),
}));

jest.mock("@/db/profile/queries", () => ({
  getUser: jest.fn(),
}));

jest.mock("@/db/profile/mutations/update-user", () => ({
  updateUser: jest.fn(),
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
        { item: { id: "item1" } },
        { item: { id: "item2" } },
        { item: { id: "item3" } },
      ],
    };
    (getUser as jest.Mock).mockResolvedValue(user);

    // Act
    await removeFromFavorites(itemIdToRemove);

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    const expectedFavorites = [
      { item: { id: "item1" } },
      { item: { id: "item3" } },
    ];
    expect(updateUser).toHaveBeenCalledWith({ favorites: expectedFavorites });
  });

  it("should not call updateUser if user is not found", async () => {
    // Arrange
    (getUser as jest.Mock).mockResolvedValue(null);

    // Act
    await removeFromFavorites("some-id");

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("should handle removing an item that is not in favorites", async () => {
    // Arrange
    const itemIdToRemove = "non-existent-item";
    const user = {
      favorites: [
        { item: { id: "item1" } },
        { item: { id: "item2" } },
      ],
    };
    (getUser as jest.Mock).mockResolvedValue(user);

    // Act
    await removeFromFavorites(itemIdToRemove);

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(1);
    const expectedFavorites = [
        { item: { id: "item1" } },
        { item: { id: "item2" } },
    ];
    expect(updateUser).toHaveBeenCalledWith({ favorites: expectedFavorites });
  });
});

