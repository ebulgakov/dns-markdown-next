// Import the function to be tested
import { getUserSections } from '../get-user-sections';

// Mock dependencies
import { dbConnect } from '@/db/database';
import { getUser } from '../get-user';
import { User } from '@/types/user';

// Mock the modules
jest.mock('@/db/database', () => ({
  dbConnect: jest.fn(),
}));

jest.mock('../get-user', () => ({
  getUser: jest.fn(),
}));

// Typecast the mocked functions to be able to use mockResolvedValue
const mockedGetUser = getUser as jest.Mock;
const mockedDbConnect = dbConnect as jest.Mock;

describe('getUserSections', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: User exists and has favorite and hidden sections
  it('should return favorite and hidden sections when user exists', async () => {
    const mockUser: Partial<User> = {
      favoriteSections: ['laptops', 'smartphones'],
      hiddenSections: ['tablets'],
    };
    mockedGetUser.mockResolvedValue(mockUser);

    const result = await getUserSections();

    expect(result).toEqual({
      favorites: ['laptops', 'smartphones'],
      hidden: ['tablets'],
    });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
  });

  // Test case 2: User exists but has no favorite or hidden sections
  it('should return undefined for sections when user exists but has none', async () => {
    const mockUser: Partial<User> = {};
    mockedGetUser.mockResolvedValue(mockUser);

    const result = await getUserSections();

    expect(result).toEqual({
      favorites: undefined,
      hidden: undefined,
    });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
  });

  // Test case 3: User does not exist
  it('should return undefined for sections when user does not exist', async () => {
    mockedGetUser.mockResolvedValue(null);

    const result = await getUserSections();

    expect(result).toEqual({
      favorites: undefined,
      hidden: undefined,
    });
    expect(mockedDbConnect).toHaveBeenCalledTimes(1);
    expect(mockedGetUser).toHaveBeenCalledTimes(1);
  });

  // Test case 4: dbConnect is called
  it('should call dbConnect', async () => {
    mockedGetUser.mockResolvedValue(null);
    await getUserSections();
    expect(mockedDbConnect).toHaveBeenCalled();
  });
});

