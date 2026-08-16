import type { Favorite } from "@/entities/product";

// Favorite/FavoriteStatus are owned by entities/product (a favorite embeds
// a full Goods object; the metadata itself has no user-specific fields) —
// re-exported here so consumers of @/entities/user keep working unchanged.
export type { Favorite, FavoriteStatus } from "@/entities/product";

export type UserSections = string[];

export type UserNotifications = {
  updates: {
    enabled: boolean;
  };
};

export interface User {
  _id: string;
  userId: string;
  username?: string;
  email: string;
  city: string;
  shownBoughtFavorites: boolean;
  hiddenSections: UserSections;
  favoriteSections: UserSections;
  notifications: UserNotifications;
  favorites: Favorite[];
}
