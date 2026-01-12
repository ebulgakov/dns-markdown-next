import { currentUser } from "@clerk/nextjs/server";

import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import { getUser } from "../get-user";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@clerk/nextjs/server", () => ({ currentUser: jest.fn() }));
jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));
jest.mock("@/db/models/user-model", () => ({
  User: { findOne: jest.fn() }
}));

describe("getUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user data if a user is found in the database", async () => {
    const clerkUser = { id: "user_123" };
    const dbUser = {
      userId: "user_123",
      firstName: "John",
      lastName: "Doe",
      favorites: []
    };

    // @ts-expect-error -- mocking
    jest.mocked(currentUser).mockResolvedValue(clerkUser);
    jest.mocked(User.findOne).mockResolvedValue(dbUser);

    const result = await getUser();

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(currentUser).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ userId: clerkUser.id });
    expect(result).toEqual(dbUser);
  });

  it("should throw an error if no user is found in the database", async () => {
    const clerkUser = { id: "user_456" };
    // @ts-expect-error -- mocking
    jest.mocked(currentUser).mockResolvedValue(clerkUser);
    jest.mocked(User.findOne).mockResolvedValue(null);

    await expect(getUser()).rejects.toThrow("User not found");

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(currentUser).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ userId: clerkUser.id });
  });

  it("should throw an error if there is no authenticated user", async () => {
    jest.mocked(currentUser).mockResolvedValue(null);

    await expect(getUser()).rejects.toThrow("User not authenticated");

    expect(dbConnect).not.toHaveBeenCalled();
    expect(currentUser).toHaveBeenCalledTimes(1);
    expect(User.findOne).not.toHaveBeenCalled();
  });
});
