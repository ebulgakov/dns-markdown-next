import { getUser } from "@/api";

import { getPriceListCity } from "../get-price-list-city";

jest.mock("@/api", () => ({
  getUser: jest.fn()
}));

jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

const mockedGetUser = getUser as jest.Mock;

describe("getPriceListCity", () => {
  const defaultCity = "DefaultCity";
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      DEFAULT_CITY: defaultCity
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns the user's city when the user is successfully fetched and has a city", async () => {
    const userCity = "UserCity";
    mockedGetUser.mockResolvedValue({ city: userCity });

    const city = await getPriceListCity();

    expect(city).toBe(userCity);
  });

  it("returns the default city when the user is not found", async () => {
    mockedGetUser.mockResolvedValue(null);

    const city = await getPriceListCity();

    expect(city).toBe(defaultCity);
  });

  it("returns the default city when fetching the user throws an error", async () => {
    mockedGetUser.mockRejectedValue(new Error("Database error"));

    const city = await getPriceListCity();

    expect(city).toBe(defaultCity);
  });
});
