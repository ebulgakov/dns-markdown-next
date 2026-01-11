import { dbConnect } from "@/db/database";
import { History } from "@/db/models/history-model";
import { Pricelist } from "@/db/models/pricelist-model";

import { getProductById } from "../get-product-by-id";

import type { History as HistoryType } from "@/types/history";

jest.mock("@/db/database", () => ({ dbConnect: jest.fn() }));
jest.mock("@/db/models/history-model", () => ({ History: { findOne: jest.fn() } }));
jest.mock("@/db/models/pricelist-model", () => ({ Pricelist: { findOne: jest.fn() } }));
jest.mock("@/cache", () => ({ __esModule: true, default: { get: jest.fn(), set: jest.fn() } }));

const mockedDbConnect = dbConnect as jest.Mock;
const mockedHistoryFindOne = History.findOne as jest.Mock;
const mockedPricelistFindOne = Pricelist.findOne as jest.Mock;

describe("getProductById", () => {
  const productId = "test-product-id";
  const mockCity = "TestCity";

  beforeEach(() => jest.clearAllMocks());

  afterEach(() => {
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedHistoryFindOne).toHaveBeenCalledWith(
      { link: productId },
      {},
      { sort: { updatedAt: -1 } }
    );
  });

  test("should throw 'History not found' if history is not found", async () => {
    mockedHistoryFindOne.mockResolvedValue(null);

    await expect(getProductById(productId)).rejects.toThrow("History not found");
    expect(mockedPricelistFindOne).not.toHaveBeenCalled();
  });

  test("should throw 'Price list not found' if pricelist is not found", async () => {
    const mockHistory: Partial<HistoryType> = { city: mockCity };
    mockedHistoryFindOne.mockResolvedValue(mockHistory);
    mockedPricelistFindOne.mockResolvedValue(null);

    await expect(getProductById(productId)).rejects.toThrow("Price list not found");
    expect(mockedPricelistFindOne).toHaveBeenCalledWith(
      { city: mockCity },
      {},
      { sort: { updatedAt: -1 } }
    );
  });

  test("should throw 'Product Item not found' if item is not in pricelist", async () => {
    const mockHistory: Partial<HistoryType> = { city: mockCity };
    const mockPriceList = { positions: [{ items: [{ link: "other-id" }] }] };
    mockedHistoryFindOne.mockResolvedValue(mockHistory);
    mockedPricelistFindOne.mockResolvedValue(mockPriceList);

    await expect(getProductById(productId)).rejects.toThrow("Product Item not found");
  });

  test("should return item and history when product is found", async () => {
    const mockHistory: Partial<HistoryType> = { city: mockCity, link: productId };
    const mockItem = { link: productId, name: "Test Product" };
    const mockPriceList = { positions: [{ items: [mockItem] }] };
    mockedHistoryFindOne.mockResolvedValue(mockHistory);
    mockedPricelistFindOne.mockResolvedValue(mockPriceList);

    const result = await getProductById(productId);

    expect(result).toEqual({
      item: { ...mockItem, city: mockCity },
      history: mockHistory
    });
  });
});
