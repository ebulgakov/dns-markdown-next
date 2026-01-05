import { Goods } from "./pricelist";

export type FavoriteStatus = {
  city: string;
  updatedAt: Date | string;
  createdAt: Date | string;
  deleted: boolean;
  updates: [];
};

export type AvailableUpdateSectionNames = "hiddenSections" | "favoriteSections";

export type UserSections = string[];

export type UserNotifications = {
  updates: {
    interval: string;
    fields: {
      new: boolean;
      prices: boolean;
      profit: boolean;
    };
  };
  favorites: {
    interval: string;
  };
  favoriteSections: {
    interval: string;
  };
};

export interface Favorite {
  id: string;
  status: FavoriteStatus;
  item: Goods;
}

export interface User {
  _id: string;
  id: string;
  userId: string;
  city: string;
  hiddenSections: UserSections;
  favoriteSections: UserSections;
  notifications: UserNotifications;
  favorites: Favorite[];
}
