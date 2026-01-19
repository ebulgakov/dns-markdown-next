import { add, get } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import { mockPriceList, sortedByDiscount, brokenPosition } from "../__mocks__/discounted_sort_list";
import { getMostDiscountedGoods } from "../get-most-discounted-goods";

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
const date = "2023-10-27";

describe("getMostDiscountedGoods", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("throws an error if city or date is not provided", async () => {
    await expect(getMostDiscountedGoods("", date)).rejects.toThrow("city|date is required");
    await expect(getMostDiscountedGoods(city, "")).rejects.toThrow("city|date is required");
  });

  it("returns cached data if available", async () => {
    mockedCacheGet.mockResolvedValue(sortedByDiscount);

    const result = await getMostDiscountedGoods(city, date);

    expect(result).toEqual(sortedByDiscount);
    expect(mockedCacheGet).toHaveBeenCalledWith(`pricelist:mostdiscountedgoods:${city}-${date}`);
    expect(mockedDbConnect).not.toHaveBeenCalled();
  });

  it("returns sorted goods when no cache is available", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    const result = await getMostDiscountedGoods(city, date);

    expect(result).toEqual(sortedByDiscount);
    expect(mockedDbConnect).toHaveBeenCalled();
    expect(mockedGetLastPriceList).toHaveBeenCalledWith(city);
    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostdiscountedgoods:${city}-${date}`,
      JSON.stringify(sortedByDiscount),
      { ex: 60 * 60 * 24 }
    );
  });

  it("throws an error if no price list is found for the city", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(null);

    await expect(getMostDiscountedGoods(city, date)).rejects.toThrow("Price list not found");
  });

  it("places items with zero or invalid priceOld at the end", async () => {
    const priceListWithInvalidItems: PriceList = {
      ...mockPriceList,
      positions: [brokenPosition, ...mockPriceList.positions]
    };
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(priceListWithInvalidItems);

    const result = await getMostDiscountedGoods(city, date);

    expect(result).toEqual([...sortedByDiscount, ...brokenPosition.items]);
  });

  it("caches the sorted goods", async () => {
    mockedCacheGet.mockResolvedValue(null);
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);

    await getMostDiscountedGoods(city, date);

    expect(mockedCacheAdd).toHaveBeenCalledWith(
      `pricelist:mostdiscountedgoods:${city}-${date}`,
      JSON.stringify(sortedByDiscount),
      { ex: 60 * 60 * 24 }
    );
  });
});
