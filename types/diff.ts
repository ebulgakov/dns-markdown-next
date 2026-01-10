import type { Goods } from "@/types/pricelist";

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
  changesPrice: GoodsDiff[];
  changesProfit: GoodsDiff[];
}

export type DiffsCollection = { [key: string]: GoodDiffChanges };
