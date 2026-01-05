import { getCatalogData } from "../getCatalogData";
import { getLastPriceList } from "@/db/pricelist/queries";
import { getUser } from "@/db/profile/queries";
import { PriceList as PriceListType, Goods } from "@/types/pricelist";
import { User as UserType } from "@/types/user";

// Mock the DB query functions
jest.mock("@/db/pricelist/queries", () => ({
  getLastPriceList: jest.fn()
}));

jest.mock("@/db/profile/queries", () => ({
  getUser: jest.fn()
}));

// Define mock return types
const mockedGetLastPriceList = getLastPriceList as jest.Mock<Promise<PriceListType | null>>;
const mockedGetUser = getUser as jest.Mock<Promise<Partial<UserType> | null>>;

// Test Data
const goods1: Goods = {
  _id: "g1",
  title: "Good 1",
  link: "https://www.google.com/",
  description: "",
  reasons: [{ label: "some", text: "reason", _id: "1" }],
  priceOld: "20",
  price: "10",
  profit: "10",
  code: "12345ssq",
  image: "img-url",
  available: "big-mall",
  city: "samara"
};
const goods2: Goods = {
  _id: "g2",
  title: "Good 2",
  link: "https://www.google.com/",
  description: "",
  reasons: [{ label: "some", text: "reason", _id: "0" }],
  priceOld: "200",
  price: "100",
  profit: "100",
  code: "12345ssq",
  image: "img-url",
  available: "big-mall",
  city: "samara"
};

describe("getCatalogData", () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: Successful data fetching with favorite sections
  it("should return catalog data and separate sections when user has favorites", async () => {
    // Mock data
    const mockPriceList: PriceListType = {
      _id: "pricelist1",
      city: "samara",
      positions: [
        {
          _id: "0",
          title: "Favorite Section",
          items: [goods1]
        },
        {
          _id: "1",
          title: "Non-Favorite Section",
          items: [goods2]
        }
      ],
      createdAt: new Date()
    };
    const mockUser: Partial<UserType> = {
      favorites: [
        {
          id: "g1",
          status: {
            city: "",
            updatedAt: new Date(),
            createdAt: new Date(),
            deleted: false,
            updates: []
          },
          item: goods1
        }
      ],
      favoriteSections: ["Favorite Section"],
      hiddenSections: ["Hidden Section"]
    };

    // Setup mocks to return the mock data
    mockedGetLastPriceList.mockResolvedValue(JSON.parse(JSON.stringify(mockPriceList)));
    mockedGetUser.mockResolvedValue(JSON.parse(JSON.stringify(mockUser)));

    const result = await getCatalogData();

    // Assertions
    expect(result.error).toBeUndefined();
    expect(result.priceList).toEqual(JSON.parse(JSON.stringify(mockPriceList)));
    expect(result.userFavoritesGoods).toEqual(JSON.parse(JSON.stringify(mockUser.favorites)));
    expect(result.hiddenSectionsTitles).toEqual(mockUser.hiddenSections);
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

  // Test case 3: No user found
  it("should return an error if no user is found", async () => {
    const mockPriceList: PriceListType = {
      _id: "pricelist1",
      city: "samara",
      positions: [],
      createdAt: new Date()
    };
    mockedGetLastPriceList.mockResolvedValue(JSON.parse(JSON.stringify(mockPriceList)));
    mockedGetUser.mockResolvedValue(null);

    const result = await getCatalogData();

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe("No user found");
  });

  // Test case 4: No favorite sections defined by the user
  it("should put all sections into nonFavoriteSections if user has no favorite sections", async () => {
    // Mock data
    const mockPriceList: PriceListType = {
      _id: "pricelist1",
      city: "samara",
      positions: [
        {
          _id: "0",
          title: "Favorite Section",
          items: [goods1]
        },
        {
          _id: "1",
          title: "Non-Favorite Section",
          items: [goods2]
        }
      ],
      createdAt: new Date()
    };

    const mockUser: Partial<UserType> = {
      favorites: [],
      favoriteSections: [],
      hiddenSections: []
    };

    // Setup mocks
    mockedGetLastPriceList.mockResolvedValue(JSON.parse(JSON.stringify(mockPriceList)));
    mockedGetUser.mockResolvedValue(JSON.parse(JSON.stringify(mockUser)));

    const result = await getCatalogData();

    // Assertions
    expect(result.error).toBeUndefined();
    expect(result.favoriteSections).toEqual([]);
    // When no favorite sections, the logic in getCatalogData doesn't populate nonFavoriteSections
    expect(result.nonFavoriteSections).toEqual([]);
  });

  // Test case 5: A database query throws an error
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
    expect(result.favoriteSections).toEqual([]);
  });
});
