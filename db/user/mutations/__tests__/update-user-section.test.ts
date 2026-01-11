// Import the function to be tested

// Mock dependencies
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

import { updateUserSection } from "../update-user-section";

import type { User } from "@/types/user";

// Mock the modules
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/user/mutations/update-user", () => ({
  updateUser: jest.fn()
}));

// Type assertion for mocked functions
const mockedUpdateUser = updateUser as jest.Mock;
const mockedDbConnect = dbConnect as jest.Mock;

describe("updateUserSection", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case for successful update of a section
  it("should update user section and return the updated section", async () => {
    const updatedSections = ["section1", "section2"];
    const updatedUser: Partial<User> = {
      _id: "1",
      hiddenSections: updatedSections
    };

    // Mock updateUser to return the updated user
    mockedUpdateUser.mockResolvedValue(updatedUser);

    const result = await updateUserSection(updatedSections, "hiddenSections");

    // Assertions
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
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

  // Test case for updateUser returning null
  it("should throw an error if updateUser returns null", async () => {
    mockedUpdateUser.mockResolvedValue(null);

    await expect(updateUserSection(["section1"], "hiddenSections")).rejects.toThrow(
      "Failed to update user or user not found"
    );
  });
});
