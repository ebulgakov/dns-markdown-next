import type { User } from "@/types/user";

export const mockUser: User = {
  _id: "1",
  id: "1",
  userId: "user123",
  username: "testuser",
  email: "testuser@example.com",
  city: "Самара",
  shownBoughtFavorites: false,
  hiddenSections: [],
  favoriteSections: [],
  notifications: {
    updates: {
      interval: "daily",
      fields: {
        new: true,
        prices: true,
        profit: true
      }
    },
    favorites: {
      interval: "weekly"
    },
    favoriteSections: {
      interval: "monthly"
    }
  },
  favorites: []
};
