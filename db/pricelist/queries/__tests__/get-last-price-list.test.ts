import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import { getLastPriceList } from "../get-last-price-list";

import type { PriceList } from "@/types/pricelist";

jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/cache", () => ({ __esModule: true, default: { get: jest.fn(), set: jest.fn() } }));

jest.mock("@/db/models/pricelist-model", () => ({
  Pricelist: {
    findOne: jest.fn()
  }
}));

const mockedDbConnect = dbConnect as jest.Mock;
const mockedFindOne = Pricelist.findOne as jest.Mock;

describe("getLastPriceList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if no price list is found", async () => {
    mockedFindOne.mockResolvedValue(null);

    await expect(getLastPriceList("NonExistentCity")).rejects.toThrow("Price list not found");

    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedFindOne).toHaveBeenCalledWith(
      { city: "NonExistentCity" },
      {},
      { sort: { updatedAt: -1 } }
    );
  });

  it("should return the last price list for a given city", async () => {
    const mockPriceList: Partial<PriceList> = {
      _id: "some-id",
      city: "TestCity"
    };
    mockedFindOne.mockResolvedValue(mockPriceList);

    const result = await getLastPriceList("TestCity");

    expect(result).toEqual(mockPriceList);
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedFindOne).toHaveBeenCalledWith(
      { city: "TestCity" },
      {},
      { sort: { updatedAt: -1 } }
    );
  });
});
