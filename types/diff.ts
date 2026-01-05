import { Goods } from "./pricelist.ts";

export type GoodDiffChanges = {
  priceOld: string;
  price: string;
  profit: string;
};
export interface GoodsDiff {
  item: Goods;
  diff: GoodDiffChanges;
}

export interface Diff {
  city: string;
  new: GoodsDiff[];
  changesPrice: GoodsDiff[];
  changesProfit: GoodsDiff[];
}

export type DiffsCollection = { [key: string]: GoodDiffChanges }
