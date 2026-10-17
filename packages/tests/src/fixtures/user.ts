import { makeGoods } from "./goods";

import type { User } from "@dns-markdown/types/user";

export const makeUser = (overrides: Partial<User> = {}): User => ({
  _id: "user-id",
  userId: "clerk-user-id",
  email: "user@example.com",
  city: "samara",
  shownBoughtFavorites: false,
  hiddenSections: [],
  favoriteSections: [],
  notifications: { updates: { enabled: true } },
  favorites: [
    {
      _id: "favorite-id",
      status: {
        createdAt: "2026-10-01T10:00:00.000Z",
        updatedAt: "2026-10-01T10:00:00.000Z",
        deleted: false,
        city: "samara"
      },
      item: makeGoods()
    }
  ],
  ...overrides
});
