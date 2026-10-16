import type { Goods } from "./pricelist";

export type FavoriteStatus = {
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
  city: string;
};

export interface Favorite {
  id: string;
  status: FavoriteStatus;
  item: Goods;
}
