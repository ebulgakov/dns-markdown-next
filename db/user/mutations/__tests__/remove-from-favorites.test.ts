import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

import { removeFromFavorites } from "../remove-from-favorites";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/db/user/queries", () => ({ getUser: jest.fn() }));
jest.mock("@/db/user/mutations/update-user", () => ({ updateUser: jest.fn() }));

const mockGetUser = getUser as jest.Mock;

describe("removeFromFavorites", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should remove an item from favorites", async () => {
    const initialFavorites = ["item1", "item2", "item3"].map(link => ({ item: { link } }));
    mockGetUser.mockResolvedValue({ favorites: initialFavorites });

    await removeFromFavorites("item2");

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({
      favorites: [{ item: { link: "item1" } }, { item: { link: "item3" } }]
    });
  });

  it("should throw an error if user is not found", async () => {
    mockGetUser.mockResolvedValue(null);

    await expect(removeFromFavorites("some-id")).rejects.toThrow("User not found");

    expect(updateUser).not.toHaveBeenCalled();
  });

  it("should not change favorites if item to remove is not found", async () => {
    const initialFavorites = [{ item: { link: "item1" } }, { item: { link: "item2" } }];
    mockGetUser.mockResolvedValue({ favorites: initialFavorites });

    await removeFromFavorites("non-existent-item");

    expect(updateUser).toHaveBeenCalledWith({ favorites: initialFavorites });
  });

  it("should throw an error if no link is provided", async () => {
    await expect(removeFromFavorites(null as never)).rejects.toThrow("No link provided");

    expect(dbConnect).not.toHaveBeenCalled();
    expect(getUser).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });
});
