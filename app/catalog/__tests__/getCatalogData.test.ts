import { getLastPriceList } from "@/api";
import { getUser } from "@/api";
import { getPriceListCity } from "@/db/pricelist/queries";
import { mockGoods } from "@/db/user/__mocks__/pricelist";

import { getCatalogData } from "../get-catalog-data";

import type { PriceList as PriceListType } from "@/types/pricelist";
import type { User as UserType } from "@/types/user";

jest.mock("@/api", () => ({
  getLastPriceList: jest.fn(),
  getUser: jest.fn()
}));
jest.mock("@/db/pricelist/queries", () => ({
  getPriceListCity: jest.fn()
}));

const mockedGetLastPriceList = getLastPriceList as jest.Mock;
const mockedGetUser = getUser as jest.Mock;
const mockedGetPriceListCity = getPriceListCity as jest.Mock;
console.error = jest.fn();

describe("getCatalogData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return catalog data and separate sections when user has favorites", async () => {
    const mockPriceList: PriceListType = {
      _id: "pricelist1",
      city: "TestCity",
      positions: [
        { _id: "0", title: "Favorite Section", items: [mockGoods[0]] },
        { _id: "1", title: "Non-Favorite Section", items: [mockGoods[1]] }
      ],
      createdAt: new Date()
    };
    const mockUser: Partial<UserType> = {
      favorites: [
        {
          id: "g1",
          status: {
            city: "",
            updatedAt: `${new Date()}`,
            createdAt: `${new Date()}`,
            deleted: false
          },
          item: mockGoods[0]
        }
      ],
      favoriteSections: ["Favorite Section"],
      hiddenSections: ["Hidden Section"]
    };

    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);
    mockedGetUser.mockResolvedValue(mockUser);

    const result = await getCatalogData();

    expect(result.priceList).toEqual(mockPriceList);
    expect(result.userFavoritesGoods).toEqual(mockUser.favorites);
    expect(result.hiddenSectionsTitles).toEqual(mockUser.hiddenSections);
    expect(result.favoriteSections).toHaveLength(1);
    expect(result.favoriteSections?.[0].title).toBe("Favorite Section");
    expect(result.nonFavoriteSections).toHaveLength(1);
    expect(result.nonFavoriteSections?.[0].title).toBe("Non-Favorite Section");
  });

  it("should return an error if no city is found", async () => {
    mockedGetPriceListCity.mockResolvedValue(null);

    await expect(getCatalogData()).rejects.toThrow("City not found");
  });

  it("should return an error if no price list is found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    mockedGetLastPriceList.mockResolvedValue(null);
    mockedGetUser.mockResolvedValue({});

    await expect(getCatalogData()).rejects.toThrow("Price list not found");
  });

  it("should not return an error if no user is found", async () => {
    mockedGetPriceListCity.mockResolvedValue("TestCity");
    const mockPriceList: PriceListType = {
      _id: "pricelist1",
      city: "TestCity",
      positions: [],
      createdAt: new Date()
    };
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);
    mockedGetUser.mockResolvedValue(null);

    const result = await getCatalogData();

    expect(result).toEqual({
      favoriteSections: [],
      hiddenSectionsTitles: [],
      nonFavoriteSections: [],
      priceList: mockPriceList,
      userFavoritesGoods: []
    });
  });

  it("should put all sections into nonFavoriteSections if user has no favorite sections", async () => {
    const mockPriceList: PriceListType = {
      _id: "pricelist1",
      city: "TestCity",
      positions: [
        { _id: "0", title: "Favorite Section", items: [mockGoods[0]] },
        { _id: "1", title: "Non-Favorite Section", items: [mockGoods[1]] }
      ],
      createdAt: new Date()
    };
    const mockUser: Partial<UserType> = { favorites: [], favoriteSections: [], hiddenSections: [] };

    mockedGetLastPriceList.mockResolvedValue(JSON.parse(JSON.stringify(mockPriceList)));
    mockedGetUser.mockResolvedValue(JSON.parse(JSON.stringify(mockUser)));

    const result = await getCatalogData();

    expect(result.favoriteSections).toEqual([]);
    expect(result.nonFavoriteSections).toEqual([]);
  });

  it("should return an error if a database query fails", async () => {
    const dbError = new Error("Database connection failed");
    mockedGetLastPriceList.mockRejectedValue(dbError);

    await expect(getCatalogData()).rejects.toThrow("Price list not found");
  });
});
