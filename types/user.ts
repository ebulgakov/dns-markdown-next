import type { Goods } from "./pricelist";

export type FavoriteStatus = {
  city: string;
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
};

export type AvailableUpdateSectionNames = "hiddenSections" | "favoriteSections" | "notifications";

export type UserSections = string[];

export type UserNotifications = {
  updates: {
    enabled: boolean;
  };
};

export interface Favorite {
  id: string;
  status: FavoriteStatus;
  item: Goods;
}

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
