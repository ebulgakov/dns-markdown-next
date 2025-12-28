import { getUserFavorites } from '../get-user-favorites';
import { getUser } from '../get-user';
import { dbConnect } from '@/db/database';

// Mock dependencies
jest.mock('@/db/database', () => ({
  dbConnect: jest.fn(),
}));

jest.mock('../get-user', () => ({
  getUser: jest.fn(),
}));

// Type assertion for the mocked function
const mockedGetUser = getUser as jest.Mock;

describe('getUserFavorites', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if user is not found', async () => {
    // Mock getUser to return undefined
    mockedGetUser.mockResolvedValue(undefined);

    const favorites = await getUserFavorites();

    // Expect dbConnect to have been called
    expect(dbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(getUser).toHaveBeenCalledTimes(1);
    // Expect favorites to be an empty array
    expect(favorites).toEqual([]);
  });

  it('should return an empty array if user has no favorites', async () => {
    // Mock user with empty favorites
    const mockUser = {
      favorites: [],
    };
    mockedGetUser.mockResolvedValue(mockUser);

    const favorites = await getUserFavorites();

    // Expect dbConnect to have been called
    expect(dbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(getUser).toHaveBeenCalledTimes(1);
    // Expect favorites to be an empty array
    expect(favorites).toEqual([]);
  });

  it('should return reversed favorites if user has favorites', async () => {
    // Mock user with favorites
    const mockUser = {
      favorites: ['item1', 'item2', 'item3'],
    };
    mockedGetUser.mockResolvedValue(mockUser);

    const favorites = await getUserFavorites();

    // Expect dbConnect to have been called
    expect(dbConnect).toHaveBeenCalledTimes(1);
    // Expect getUser to have been called
    expect(getUser).toHaveBeenCalledTimes(1);
    // Expect favorites to be the reversed array
    expect(favorites).toEqual(['item3', 'item2', 'item1']);
  });
});

