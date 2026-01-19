import { add, get } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import { mockPriceList, sortedByPrice, brokenPosition } from "../__mocks__/price_sort_list";
import { getMostCheapGoods } from "../get-most-cheap-goods";

import type { PriceList } from "@/types/pricelist";

jest.mock("@/db/pricelist/queries/get-last-price-list", () => ({
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
const date = "2023-01-01";

describe("getMostCheapGoods", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws an error if city or date is not provided", async () => {
    await expect(getMostCheapGoods("", date)).rejects.toThrow("city|date is required");
    await expect(getMostCheapGoods(city, "")).rejects.toThrow("city|date is required");
  });

  it("returns cached data if available", async () => {
    mockedCacheGet.mockResolvedValue(sortedByPrice);

    const result = await getMostCheapGoods(city, date);

    expect(result).toEqual(sortedByPrice);
    expect(mockedCacheGet).toHaveBeenCalledWith(`pricelist:mostcheapgoods:${city}-${date}`);
    expect(mockedDbConnect).not.toHaveBeenCalled();
  });

  it("returns sorted goods when no cache is available", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    const result = await getMostCheapGoods(city, date);

    expect(result).toEqual(sortedByPrice);
    expect(mockedDbConnect).toHaveBeenCalled();
    expect(mockedGetLastPriceList).toHaveBeenCalledWith(city);
    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostcheapgoods:${city}-${date}`,
      JSON.stringify(sortedByPrice),
      { ex: 60 * 60 * 24 }
    );
  });

  it("throws an error if no price list is found for the city", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(null);

    await expect(getMostCheapGoods(city, date)).rejects.toThrow("Price list not found");
  });

  it("filters out items with zero or invalid price", async () => {
    const priceListWithInvalidItems: PriceList = {
      ...mockPriceList,
      positions: [...mockPriceList.positions, brokenPosition]
    };
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(priceListWithInvalidItems);

    const result = await getMostCheapGoods(city, date);

    expect(result).toEqual(sortedByPrice);
  });

  it("caches the sorted goods", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    await getMostCheapGoods(city, date);

    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostcheapgoods:${city}-${date}`,
      JSON.stringify(sortedByPrice),
      { ex: 60 * 60 * 24 }
    );
  });
});
