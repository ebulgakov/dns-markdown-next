import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";
import { getUser } from "@/db/user/queries";

import { updateUser } from "../update-user";

// Mock the database connection and User model
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/models/user-model", () => ({
  User: {
    findByIdAndUpdate: jest.fn()
  }
}));

jest.mock("@/cache", () => ({
  get: jest.fn(),
  set: jest.fn()
}));

jest.mock("@/db/user/queries", () => ({
  getUser: jest.fn()
}));

describe("updateUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to the database", async () => {
    // Arrange
    (getUser as jest.Mock).mockResolvedValue(null);

    // Act
    await expect(updateUser({})).rejects.toThrow("Cannot read properties of null (reading '_id')");

    // Assert
    expect(dbConnect).toHaveBeenCalledTimes(1);
  });

  it("should not update if user is not found", async () => {
    // Arrange
    (getUser as jest.Mock).mockResolvedValue(null);
    const update = { name: "New Name" };

    // Act
    await expect(updateUser(update)).rejects.toThrow(
      "Cannot read properties of null (reading '_id')"
    );

    // Assert
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should update the user if user is found", async () => {
    // Arrange
    const mockUser = { _id: "user123", name: "Old Name", userId: "some-user-id" };
    const updatedUser = { ...mockUser, name: "New Name" };
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    const update = { name: "New Name" };

    // Act
    await updateUser(update);

    // Assert
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, update, { new: true });
    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});
