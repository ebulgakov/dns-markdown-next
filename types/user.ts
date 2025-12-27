import { Goods } from "./pricelist";

export interface Favorite {
  status: {
    city: string;
    updatedAt: string;
    createdAt: string;
    deleted: boolean;
    updates: [];
  };
  item: Goods;
}

export interface User {
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
