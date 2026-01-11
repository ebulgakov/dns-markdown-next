// Import dependencies
import { dbConnect } from "@/db/database";
import { mockUser } from "@/db/user/__mocks__/user";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

import { toggleBoughtVisibilityFavorites } from "../toggle-bought-visibility-favorites";

// Mock dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/user/queries", () => ({
  getUser: jest.fn()
}));

jest.mock("@/db/user/mutations/update-user", () => ({
  updateUser: jest.fn()
}));

describe("toggleBoughtVisibilityFavorites", () => {
  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: User not found
  it("should throw an error if user is not found", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    await expect(toggleBoughtVisibilityFavorites(true)).rejects.toThrow(
      "Cannot read properties of undefined (reading 'shownBoughtFavorites')"
    );

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(0);
    expect(updateUser).toHaveBeenCalledWith({ shownBoughtFavorites: true });
  });

  // Test case 2: Failed to update user
  it("should throw an error if user update fails", async () => {
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (updateUser as jest.Mock).mockResolvedValue(null);

    await expect(toggleBoughtVisibilityFavorites(true)).rejects.toThrow(
      "Cannot read properties of null (reading 'shownBoughtFavorites')"
    );

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(0);
    expect(updateUser).toHaveBeenCalledWith({ shownBoughtFavorites: true });
  });

  // Test case 3: Successfully toggles visibility to true
  it("should update shownBoughtFavorites to true and return the new value", async () => {
    const newStatus = true;
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (updateUser as jest.Mock).mockResolvedValue({
      ...mockUser,
      shownBoughtFavorites: newStatus
    });

    const result = await toggleBoughtVisibilityFavorites(newStatus);

    expect(result).toBe(newStatus);
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(0);
    expect(updateUser).toHaveBeenCalledWith({
      shownBoughtFavorites: newStatus
    });
  });

  // Test case 4: Successfully toggles visibility to false
  it("should update shownBoughtFavorites to false and return the new value", async () => {
    const newStatus = false;
    (getUser as jest.Mock).mockResolvedValue({
      ...mockUser,
      shownBoughtFavorites: true
    });
    (updateUser as jest.Mock).mockResolvedValue({
      ...mockUser,
      shownBoughtFavorites: newStatus
    });

    const result = await toggleBoughtVisibilityFavorites(newStatus);

    expect(result).toBe(newStatus);
    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(getUser).toHaveBeenCalledTimes(0);
    expect(updateUser).toHaveBeenCalledWith({
      shownBoughtFavorites: newStatus
    });
  });
});
