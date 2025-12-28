import { Goods } from "./pricelist";

export type FavoriteStatus = {
  city: string;
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
  updates: [];
}

export interface Favorite {
  _id: string;
  status: FavoriteStatus;
  item: Goods;
}

export interface User {
  id: string;
  userId: string;
  city: string;
  hiddenSections: string[];
  favoriteSections: string[];
  notifications: {
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
  favorites: Favorite[];
}
