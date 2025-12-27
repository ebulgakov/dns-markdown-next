import { Goods } from "@/types/pricelist";

export interface GoodsDiff {
  item: Goods;
  diff: {
    priceOld: string;
    price: string;
    profit: string;
  };
}

export interface Diff {
  city: string;
  new: GoodsDiff[];
  changesPrice: GoodsDiff[];
  changesProfit: GoodsDiff[];
}
