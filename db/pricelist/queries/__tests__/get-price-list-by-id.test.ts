import { getPriceListById } from '../get-price-list-by-id';
import { dbConnect } from '@/db/database';
import { Pricelist } from '@/db/models/pricelist_model';
import type { PriceList as PriceListType } from "@/types/pricelist";

// Mock dependencies
jest.mock('@/db/database', () => ({
  dbConnect: jest.fn(),
}));

jest.mock('@/db/models/pricelist_model', () => ({
  Pricelist: {
    findOne: jest.fn(),
  },
}));

// Type assertion for mocked functions
const mockedDbConnect = dbConnect as jest.Mock;
const mockedPricelistFindOne = Pricelist.findOne as jest.Mock;

describe('getPriceListById', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a pricelist if found', async () => {
    const mockPriceList: Partial<PriceListType> = {
      _id: '60d21b4667d0d8992e610c85',
      createdAt: `${new Date()}`,
      positions: [],
    };
    mockedPricelistFindOne.mockResolvedValue(mockPriceList);

    const result = await getPriceListById('60d21b4667d0d8992e610c85');

    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedPricelistFindOne).toHaveBeenCalledWith({ _id: '60d21b4667d0d8992e610c85' });
    expect(result).toEqual(mockPriceList);
  });

  it('should return null if pricelist is not found', async () => {
    mockedPricelistFindOne.mockResolvedValue(null);

    const result = await getPriceListById('invalid-id');

    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedPricelistFindOne).toHaveBeenCalledWith({ _id: 'invalid-id' });
    expect(result).toBeNull();
  });

  it('should throw an error if database connection fails', async () => {
    const dbError = new Error('DB connection failed');
    mockedDbConnect.mockRejectedValue(dbError);

    await expect(getPriceListById('any-id')).rejects.toThrow('DB connection failed');
    expect(mockedPricelistFindOne).not.toHaveBeenCalled();
  });
});

