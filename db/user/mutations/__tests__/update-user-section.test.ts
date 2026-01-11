import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

import { updateUserSection } from "../update-user-section";

import type { User } from "@/types/user";

jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));
jest.mock("@/db/user/mutations/update-user", () => ({
  updateUser: jest.fn()
}));

const mockedUpdateUser = updateUser as jest.Mock;

describe("updateUserSection", () => {
  beforeEach(() => {
    mockedUpdateUser.mockClear();
    (dbConnect as jest.Mock).mockClear();
  });

  it("should update user section and return the updated section", async () => {
    const updatedSections = ["section1", "section2"];
    const updatedUser: Partial<User> = { hiddenSections: updatedSections };
    mockedUpdateUser.mockResolvedValue(updatedUser);

    const result = await updateUserSection(updatedSections, "hiddenSections");

    expect(dbConnect).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({ hiddenSections: updatedSections });
    expect(result).toEqual(updatedSections);
  });

  it("should throw an error for an invalid section name", async () => {
    // @ts-expect-error Testing invalid input
    await expect(updateUserSection([], "invalidSection")).rejects.toThrow("Invalid section name");
  });

  it("should throw an error if updateUser returns null", async () => {
    mockedUpdateUser.mockResolvedValue(null);

    await expect(updateUserSection([], "hiddenSections")).rejects.toThrow(
      "Failed to update user or user not found"
    );
  });
});
