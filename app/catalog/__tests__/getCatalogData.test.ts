import { getCatalogData } from "../getCatalogData";
import { getLastPriceList } from "@/db/pricelist/queries";
import { getUserFavorites, getUserSections } from "@/db/profile/queries";
import { PriceList as PriceListType, Goods } from "@/types/pricelist";
import { Favorite, UserSections } from "@/types/user";

// Mock the DB query functions
jest.mock("@/db/pricelist/queries", () => ({
  getLastPriceList: jest.fn()
}));

jest.mock("@/db/profile/queries", () => ({
  getUserFavorites: jest.fn(),
  getUserSections: jest.fn()
}));

type SectionsType = { favorites: UserSections; hidden: UserSections };

// Define mock return types
const mockedGetLastPriceList = getLastPriceList as jest.Mock<Promise<PriceListType | null>>;
const mockedGetUserFavorites = getUserFavorites as jest.Mock<Promise<Favorite[]>>;
const mockedGetUserSections = getUserSections as unknown as jest.Mock<Promise<SectionsType>>;

// Test Data
// I know the real goods contain another properties, but for now I check only common stucture
const goods1 = { id: "g1", name: "Good 1", price: 100, quantity: 10 } as unknown as Goods;
const goods2 = { id: "g2", name: "Good 2", price: 200, quantity: 20 } as unknown as Goods;

describe("getCatalogData", () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: Successful data fetching with favorite sections
  it("should return catalog data and separate sections when user has favorites", async () => {
    // Mock data
    const mockPriceList: PriceListType = {
      id: "pricelist1",
      city: "samara",
      positions: [
        {
          title: "Favorite Section",
          items: [goods1]
        },
        {
          title: "Non-Favorite Section",
          items: [goods2]
        }
      ],
      createdAt: ""
    };
    const mockUserFavorites: Favorite[] = [
      {
        _id: "g1",
        status: {
          city: "",
          updatedAt: "",
          createdAt: "",
          deleted: false,
          updates: []
        },
        item: goods1
      }
    ];
    const mockUserSections: SectionsType = {
      favorites: ["Favorite Section"],
      hidden: ["Hidden Section"]
    };

    // Setup mocks to return the mock data
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);
    mockedGetUserFavorites.mockResolvedValue(mockUserFavorites);
    mockedGetUserSections.mockResolvedValue(mockUserSections);

    const result = await getCatalogData();

    // Assertions
    expect(result.error).toBeUndefined();
    expect(result.priceList).toEqual(mockPriceList);
    expect(result.userFavoritesGoods).toEqual(mockUserFavorites);
    expect(result.hiddenSections).toEqual(mockUserSections.hidden);
    expect(result.favoriteSections).toHaveLength(1);
    expect(result.favoriteSections?.[0].title).toBe("Favorite Section");
    expect(result.nonFavoriteSections).toHaveLength(1);
    expect(result.nonFavoriteSections?.[0].title).toBe("Non-Favorite Section");
  });

  // Test case 2: No price list found
  it("should return an error if no price list is found", async () => {
    // Setup mock to return null
    mockedGetLastPriceList.mockResolvedValue(null);

    const result = await getCatalogData();

    // Assertions
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe("No any price lists in the catalog");
    expect(result.priceList).toBeNull();
  });

  // Test case 3: No favorite sections defined by the user
  it("should put all sections into nonFavoriteSections if user has no favorite sections", async () => {
    // Mock data
    const mockPriceList: PriceListType = {
      id: "pricelist1",
      city: "samara",
      positions: [
        {
          title: "Favorite Section",
          items: [goods1]
        },
        {
          title: "Non-Favorite Section",
          items: [goods2]
        }
      ],
      createdAt: ""
    };

    const mockUserSections: SectionsType = {
      favorites: [],
      hidden: []
    };

    // Setup mocks
    mockedGetLastPriceList.mockResolvedValue(mockPriceList);
    mockedGetUserFavorites.mockResolvedValue([]);
    mockedGetUserSections.mockResolvedValue(mockUserSections);

    const result = await getCatalogData();

    // Assertions
    expect(result.error).toBeUndefined();
    expect(result.favoriteSections).toEqual([]);
    expect(result.nonFavoriteSections).toHaveLength(2);
    expect(result.nonFavoriteSections).toEqual(mockPriceList.positions);
  });

  // Test case 4: A database query throws an error
  it("should return an error if a database query fails", async () => {
    // Mock error
    const dbError = new Error("Database connection failed");

    // Setup mock to throw an error
    mockedGetLastPriceList.mockRejectedValue(dbError);

    const result = await getCatalogData();

    // Assertions
    expect(result.error).toBe(dbError);
    expect(result.priceList).toBeUndefined();
    expect(result.userFavoritesGoods).toBeUndefined();
    expect(result.favoriteSections).toBeUndefined();
  });
});
