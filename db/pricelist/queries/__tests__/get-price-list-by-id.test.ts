import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import { getPriceListById } from "../get-price-list-by-id";
jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/db/models/pricelist-model", () => ({
  Pricelist: {
    findOne: jest.fn()
  }
}));

jest.mock("@/cache", () => ({ __esModule: true, default: { get: jest.fn(), set: jest.fn() } }));

const mockedDbConnect = jest.mocked(dbConnect);
const mockedPricelistFindOne = jest.mocked(Pricelist.findOne);

describe("getPriceListById", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return a pricelist if found", async () => {
    const mockPriceList = {
      _id: "60d21b4667d0d8992e610c85",
      createdAt: `${new Date()}`,
      positions: []
    };
    mockedPricelistFindOne.mockResolvedValue(mockPriceList);

    const result = await getPriceListById("60d21b4667d0d8992e610c85");

    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedPricelistFindOne).toHaveBeenCalledWith({ _id: "60d21b4667d0d8992e610c85" });
    expect(result).toEqual(mockPriceList);
  });

  it("should return null if pricelist is not found", async () => {
    mockedPricelistFindOne.mockResolvedValue(null);

    await expect(getPriceListById("invalid-id")).rejects.toThrow("Price list not found");

    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedPricelistFindOne).toHaveBeenCalledWith({ _id: "invalid-id" });
  });

  it("should throw an error if database connection fails", async () => {
    const dbError = new Error("DB connection failed");
    mockedDbConnect.mockRejectedValue(dbError);

    await expect(getPriceListById("any-id")).rejects.toThrow("DB connection failed");
    expect(mockedPricelistFindOne).not.toHaveBeenCalled();
  });
});
