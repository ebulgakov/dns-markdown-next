import { add, get } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import { mockPriceList, sortedByPrice, brokenPosition } from "../__mocks__/default_sort_list";
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

describe("getMostCheapGoods", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws an error if city is not provided", async () => {
    await expect(getMostCheapGoods("")).rejects.toThrow("city is required");
  });

  it("returns cached data if available", async () => {
    mockedCacheGet.mockResolvedValue(sortedByPrice);

    const result = await getMostCheapGoods(city);

    expect(result).toEqual(sortedByPrice);
    expect(mockedCacheGet).toHaveBeenCalledWith(`pricelist:mostcheapgoods:${city}`);
    expect(mockedDbConnect).not.toHaveBeenCalled();
  });

  it("returns sorted goods when no cache is available", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    const result = await getMostCheapGoods(city);

    expect(result).toEqual(sortedByPrice);
    expect(mockedDbConnect).toHaveBeenCalled();
    expect(mockedGetLastPriceList).toHaveBeenCalledWith(city);
    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostcheapgoods:${city}`,
      JSON.stringify(sortedByPrice)
    );
  });

  it("throws an error if no price list is found for the city", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(null);

    await expect(getMostCheapGoods(city)).rejects.toThrow("Price list not found");
  });

  it("filters out items with zero or invalid price", async () => {
    const priceListWithInvalidItems: PriceList = {
      ...mockPriceList,
      positions: [...mockPriceList.positions, brokenPosition]
    };
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(priceListWithInvalidItems);

    const result = await getMostCheapGoods(city);

    expect(result).toEqual(sortedByPrice);
  });

  it("caches the sorted goods", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    await getMostCheapGoods(city);

    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostcheapgoods:${city}`,
      JSON.stringify(sortedByPrice)
    );
  });
});
