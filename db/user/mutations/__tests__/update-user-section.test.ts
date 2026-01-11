// Import the function to be tested

// Mock dependencies
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

import { updateUserSection } from "../update-user-section";

import type { User } from "@/types/user";

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

// Type assertion for mocked functions
const mockedGetUser = getUser as jest.Mock;
const mockedUpdateUser = updateUser as jest.Mock;
const mockedDbConnect = dbConnect as jest.Mock;

describe("updateUserSection", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case for successful update of a section
  it("should update user section and return the updated section", async () => {
    const initialUser: Partial<User> = {
      _id: "1",
      hiddenSections: []
    };
    const updatedSections = ["section1", "section2"];
    const updatedUser: Partial<User> = {
      _id: "1",
      hiddenSections: updatedSections
    };

    // Mock getUser to return the initial user first, then the updated user
    mockedGetUser.mockResolvedValueOnce(initialUser).mockResolvedValueOnce(updatedUser);

    const result = await updateUserSection(updatedSections, "hiddenSections");

    // Assertions
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(2);
    expect(mockedUpdateUser).toHaveBeenCalledWith({ hiddenSections: updatedSections });
    expect(result).toEqual(updatedSections);
  });

  // Test case for invalid section name
  it("should throw an error for an invalid section name", async () => {
    // @ts-expect-error Testing invalid input
    await expect(updateUserSection([], "invalidSectionName")).rejects.toThrow(
      "Invalid section name"
    );
  });

  // Test case for user not found initially
  it("should throw an error if user is not found", async () => {
    mockedGetUser.mockResolvedValue(null);

    await expect(updateUserSection([], "hiddenSections")).rejects.toThrow("User not found");
  });

  // Test case for user not found after update
  it("should throw an error if user is not found after update", async () => {
    const initialUser: Partial<User> = {
      _id: "1",
      hiddenSections: []
    };

    // Mock getUser to return the initial user, then null
    mockedGetUser.mockResolvedValueOnce(initialUser).mockResolvedValueOnce(null);

    await expect(updateUserSection(["section1"], "hiddenSections")).rejects.toThrow(
      "User not found after update"
    );
  });
});
