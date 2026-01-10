import { currentUser } from "@clerk/nextjs/server";

import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import { getUser } from "../get-user";

// Mock dependencies
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn()
}));

jest.mock("@/db/models/user-model", () => ({
  User: {
    findOne: jest.fn()
  }
}));

// Type assertion for mocked functions
const mockedDbConnect = dbConnect as jest.Mock;
const mockedCurrentUser = currentUser as jest.Mock;
const mockedUserFindOne = User.findOne as jest.Mock;

describe("getUser", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return user data if a user is found in the database", async () => {
    // Arrange: Set up mock data and return values
    const clerkUser = { id: "user_123" };
    const dbUser = {
      userId: "user_123",
      firstName: "John",
      lastName: "Doe",
      favorites: []
    };

    mockedCurrentUser.mockResolvedValue(clerkUser);
    mockedUserFindOne.mockResolvedValue(dbUser);

    // Act: Call the function being tested
    const result = await getUser();

    // Assert: Check if the function behaved as expected
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockedUserFindOne).toHaveBeenCalledWith({ userId: clerkUser.id });
    expect(result).toEqual(dbUser);
  });

  it("should return null if no user is found in the database", async () => {
    // Arrange: Set up mock data for a non-existent user
    const clerkUser = { id: "user_456" };
    mockedCurrentUser.mockResolvedValue(clerkUser);
    mockedUserFindOne.mockResolvedValue(null);

    // Act: Call the function
    const result = await getUser();

    // Assert: Check the results for a non-existent user
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockedUserFindOne).toHaveBeenCalledWith({ userId: clerkUser.id });
    expect(result).toBeNull();
  });

  it("should return null if there is no authenticated user", async () => {
    // Arrange: Mock that there is no authenticated user
    mockedCurrentUser.mockResolvedValue(null);

    // Act: Call the function
    const result = await getUser();

    // Assert: Check that findOne is called with null and result is null
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockedUserFindOne).toHaveBeenCalledWith({ userId: undefined });
    expect(result).toBeNull();
  });
});
