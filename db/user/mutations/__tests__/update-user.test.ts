import { getUser } from "@/api/get";
import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import { updateUser } from "../update-user";

// Mock dependencies
jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/db/models/user-model", () => ({ User: { findByIdAndUpdate: jest.fn() } }));
jest.mock("@/api/get", () => ({ getUser: jest.fn() }));

describe("updateUser", () => {
  afterEach(() => jest.clearAllMocks());

  it("should connect to the database", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    await expect(updateUser({})).rejects.toThrow("User not found");
    expect(dbConnect).toHaveBeenCalledTimes(1);
  });

  it("should not update if user is not found", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    await expect(updateUser({ name: "New Name" })).rejects.toThrow("User not found");
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should update the user if user is found", async () => {
    const mockUser = { _id: "user123", name: "Old Name", userId: "some-user-id" };
    const updatedUser = { ...mockUser, name: "New Name" };
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

    await updateUser({ name: "New Name" });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUser._id,
      { name: "New Name" },
      { new: true }
    );
  });
});
