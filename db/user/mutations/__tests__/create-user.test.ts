import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import { createUser } from "../create-user";

jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/models/user-model", () => ({
  User: { create: jest.fn() }
}));

const mockedDbConnect = dbConnect as jest.Mock;
const mockedUserCreate = User.create as jest.Mock;

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to the database and create a new user", async () => {
    const userData = {
      userId: "test-user-id",
      email: "test@test.com",
      username: "testuser"
    };

    await createUser(userData);

    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedUserCreate).toHaveBeenCalledTimes(1);
    expect(mockedUserCreate).toHaveBeenCalledWith(userData);
  });

  it.each([
    [
      "database connection",
      new Error("DB connection failed"),
      () => mockedDbConnect.mockRejectedValue(new Error("DB connection failed")),
      () => expect(mockedUserCreate).not.toHaveBeenCalled()
    ],
    [
      "user creation",
      new Error("User creation failed"),
      () => {
        mockedDbConnect.mockResolvedValue(undefined);
        mockedUserCreate.mockRejectedValue(new Error("User creation failed"));
      },
      () => expect(mockedDbConnect).toHaveBeenCalledTimes(1)
    ]
  ])("should handle errors during %s", async (_, error, setupMock, verify) => {
    setupMock();

    const userData = {
      userId: "test-user-id",
      email: "test@test.com",
      username: "testuser"
    };

    await expect(createUser(userData)).rejects.toThrow(error);

    verify();
  });
});
