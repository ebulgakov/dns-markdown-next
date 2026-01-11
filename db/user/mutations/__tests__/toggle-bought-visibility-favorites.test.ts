import { mockUser } from "@/db/user/__mocks__/user";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

import { toggleBoughtVisibilityFavorites } from "../toggle-bought-visibility-favorites";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/db/user/queries", () => ({ getUser: jest.fn() }));
jest.mock("@/db/user/mutations/update-user", () => ({ updateUser: jest.fn() }));

const mockedGetUser = getUser as jest.Mock;
const mockedUpdateUser = updateUser as jest.Mock;

describe("toggleBoughtVisibilityFavorites", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if user is not found", async () => {
    mockedGetUser.mockResolvedValue(null);
    await expect(toggleBoughtVisibilityFavorites(true)).rejects.toThrow(
      "Cannot read properties of undefined (reading 'shownBoughtFavorites')"
    );
  });

  it("should throw an error if user update fails", async () => {
    mockedGetUser.mockResolvedValue(mockUser);
    mockedUpdateUser.mockResolvedValue(null);
    await expect(toggleBoughtVisibilityFavorites(true)).rejects.toThrow(
      "Cannot read properties of null (reading 'shownBoughtFavorites')"
    );
  });

  it.each([true, false])(
    "should update shownBoughtFavorites to %s and return the new value",
    async newStatus => {
      mockedGetUser.mockResolvedValue(mockUser);
      mockedUpdateUser.mockResolvedValue({ ...mockUser, shownBoughtFavorites: newStatus });

      const result = await toggleBoughtVisibilityFavorites(newStatus);

      expect(result).toBe(newStatus);
      expect(updateUser).toHaveBeenCalledWith({ shownBoughtFavorites: newStatus });
    }
  );
});
