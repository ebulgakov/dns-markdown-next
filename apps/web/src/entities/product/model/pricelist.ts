import type { Goods } from "@dns-markdown/types/pricelist";

export type {
  Goods,
  Position,
  PriceList,
  PriceListDate,
  PriceListsArchiveCount
} from "@dns-markdown/types/pricelist";

export interface RemovedGoods {
  city: {
    type: string;
    required: true;
  };
  goods: Goods[];
}
