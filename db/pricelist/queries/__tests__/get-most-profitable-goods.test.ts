import { getLastPriceList } from "@/api";
import { add, get } from "@/cache";
import { dbConnect } from "@/db/database";

import { mockPriceList, sortedByProfit, brokenPosition } from "../__mocks__/profitable_sort_list";
import { getMostProfitableGoods } from "../get-most-profitable-goods";

import type { PriceList } from "@/types/pricelist";

jest.mock("@/api", () => ({
  getLastPriceList: jest.fn()
}));

jest.mock("@/db/database", () => ({
  dbConnect: jest.fn()
}));

jest.mock("@/cache", () => ({ get: jest.fn(), add: jest.fn() }));

const mockedCacheGet = get as jest.Mock;
const mockedCacheAdd = add as jest.Mock;
const mockedDbConnect = dbConnect as jest.Mock;
const mockedGetLastPriceList = getLastPriceList as jest.Mock;

const city = "TestCity";

describe("getMostProfitableGoods", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws an error if city is not provided", async () => {
    await expect(getMostProfitableGoods("")).rejects.toThrow("city is required");
  });

  it("returns cached data if available", async () => {
    mockedCacheGet.mockResolvedValue(sortedByProfit);

    const result = await getMostProfitableGoods(city);

    expect(result).toEqual(sortedByProfit);
    expect(mockedCacheGet).toHaveBeenCalledWith(`pricelist:mostprofitablegoods:${city}`);
    expect(mockedDbConnect).not.toHaveBeenCalled();
  });

  it("returns sorted goods when no cache is available", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    const result = await getMostProfitableGoods(city);

    expect(result).toEqual(sortedByProfit);
    expect(mockedDbConnect).toHaveBeenCalled();
    expect(mockedGetLastPriceList).toHaveBeenCalledWith(city);
    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostprofitablegoods:${city}`,
      JSON.stringify(sortedByProfit),
      { ex: 60 * 60 * 24 }
    );
  });

  it("throws an error if no price list is found for the city", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(null);

    await expect(getMostProfitableGoods(city)).rejects.toThrow("Price list not found");
  });

  it("filters out items with zero or invalid profit", async () => {
    const priceListWithInvalidItems: PriceList = {
      ...mockPriceList,
      positions: [...mockPriceList.positions, brokenPosition]
    };
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(priceListWithInvalidItems);

    const result = await getMostProfitableGoods(city);

    expect(result).toEqual([...sortedByProfit, ...brokenPosition.items]);
  });

  it("caches the sorted goods", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    await getMostProfitableGoods(city);

    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostprofitablegoods:${city}`,
      JSON.stringify(sortedByProfit),
      { ex: 60 * 60 * 24 }
    );
  });
});
