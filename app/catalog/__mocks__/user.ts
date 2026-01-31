import type { User } from "@/types/user";

export const mockUser: User = {
  _id: "1",
  userId: "user123",
  username: "testuser",
  email: "testuser@example.com",
  city: "TestCity",
  shownBoughtFavorites: false,
  hiddenSections: [],
  favoriteSections: [],
  notifications: {
    updates: {
      enabled: false
    }
  },
  favorites: []
};
