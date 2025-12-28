import { createUser } from "../create-user";
import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user_model";

// Mock the database connection and User model
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/models/user_model", () => ({
  User: {
    create: jest.fn()
  }
}));

describe("createUser", () => {
  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });

  it("should connect to the database and create a new user", async () => {
    const userId = "test-user-id";

    // Call the function
    await createUser(userId);

    // Expect dbConnect to have been called
    expect(dbConnect).toHaveBeenCalledTimes(1);

    // Expect User.create to have been called with the correct userId
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith({ userId });
  });

  it("should handle errors during database connection", async () => {
    const userId = "test-user-id";
    const errorMessage = "DB connection failed";

    // Mock dbConnect to throw an error
    (dbConnect as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Expect the function to throw an error
    await expect(createUser(userId)).rejects.toThrow(errorMessage);

    // Expect User.create not to have been called
    expect(User.create).not.toHaveBeenCalled();
  });

  it("should handle errors during user creation", async () => {
    const userId = "test-user-id";
    const errorMessage = "User creation failed";

    // Mock dbConnect to resolve successfully
    (dbConnect as jest.Mock).mockResolvedValue(undefined);

    // Mock User.create to throw an error
    (User.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Expect the function to throw an error
    await expect(createUser(userId)).rejects.toThrow(errorMessage);

    // Expect dbConnect to have been called
    expect(dbConnect).toHaveBeenCalledTimes(1);
  });
});
