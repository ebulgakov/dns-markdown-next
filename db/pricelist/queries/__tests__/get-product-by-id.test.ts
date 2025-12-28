import { getProductById } from '../get-product-by-id';
import { dbConnect } from '@/db/database';
import { History } from '@/db/models/history_model';
import { HourlyPricelist } from '@/db/models/pricelist_model';
import type { History as HistoryType } from '@/types/history';

// Mock dependencies
jest.mock('@/db/database', () => ({
  dbConnect: jest.fn(),
}));

jest.mock('@/db/models/history_model', () => ({
  History: {
    findOne: jest.fn(),
  },
}));

jest.mock('@/db/models/pricelist_model', () => ({
  HourlyPricelist: {
    findOne: jest.fn(),
  },
}));

// Create typed mocks
const mockedDbConnect = dbConnect as jest.Mock;
const mockedHistoryFindOne = History.findOne as jest.Mock;
const mockedHourlyPricelistFindOne = HourlyPricelist.findOne as jest.Mock;

describe('getProductById', () => {
  const productId = 'test-product-id';

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: History not found
  test('should return null if history is not found', async () => {
    // Arrange: Mock History.findOne to return null
    mockedHistoryFindOne.mockResolvedValue(null);

    // Act: Call the function
    const result = await getProductById(productId);

    // Assert: Check the result and that functions were called correctly
    expect(result).toBeNull();
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedHistoryFindOne).toHaveBeenCalledWith({ link: productId }, {}, { sort: { updatedAt: -1 } });
    expect(mockedHourlyPricelistFindOne).not.toHaveBeenCalled();
  });

  // Test case: Pricelist not found
  test('should return null if pricelist is not found', async () => {
    // Arrange: Mock History.findOne to return a value, but HourlyPricelist.findOne to return null
    const mockHistory: Partial<HistoryType> = { city: 'TestCity' };
    mockedHistoryFindOne.mockResolvedValue(mockHistory);
    mockedHourlyPricelistFindOne.mockResolvedValue(null);

    // Act: Call the function
    const result = await getProductById(productId);

    // Assert: Check the result and that functions were called correctly
    expect(result).toBeNull();
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedHistoryFindOne).toHaveBeenCalledWith({ link: productId }, {}, { sort: { updatedAt: -1 } });
    expect(mockedHourlyPricelistFindOne).toHaveBeenCalledWith(
      { city: mockHistory.city },
      {},
      { sort: { updatedAt: -1 } },
    );
  });

  // Test case: Item not found in pricelist
  test('should return null if item is not found in pricelist', async () => {
    // Arrange: Mock models to return values, but the item is not in the pricelist
    const mockHistory: Partial<HistoryType> = { city: 'TestCity' };
    const mockPriceList = {
      toObject: () => ({
        positions: [{ items: [{ link: 'other-id' }] }],
      }),
    };
    mockedHistoryFindOne.mockResolvedValue(mockHistory);
    mockedHourlyPricelistFindOne.mockResolvedValue(mockPriceList);

    // Act: Call the function
    const result = await getProductById(productId);

    // Assert: Check the result
    expect(result).toBeNull();
  });

  // Test case: Successfully found product
  test('should return item and history when product is found', async () => {
    // Arrange: Mock models to return complete data
    const mockHistory: Partial<HistoryType> = { city: 'TestCity', link: productId };
    const mockItem = { link: productId, name: 'Test Product' };
    const mockPriceList = {
      toObject: () => ({
        positions: [{ items: [mockItem] }],
      }),
    };
    mockedHistoryFindOne.mockResolvedValue(mockHistory);
    mockedHourlyPricelistFindOne.mockResolvedValue(mockPriceList);

    // Act: Call the function
    const result = await getProductById(productId);

    // Assert: Check that the result contains the correct data and city is added
    expect(result).toEqual({
      item: { ...mockItem, city: 'TestCity' },
      history: mockHistory,
    });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
  });
});

