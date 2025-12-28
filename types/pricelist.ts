import Goods from "@/db/models/goods_schema";

type Reason = {
  label: string;
  text: string;
};

export type Position = {
  title: string;
  items: Goods[];
};

export interface Goods {
  title: string;
  link: string;
  description: string;
  reasons: Reason[];
  priceOld: string;
  price: string;
  profit: string;
  code: string;
  image: string;
  available: string;
  city?: string;
}

export interface RemovedGoods {
  city: {
    type: string;
    required: true;
  };
  goods: Goods[];
}

export interface PriceList {
  id: string;
  city: string;
  positions: Position[];
  createdAt: string;

  toObject(): PriceList;
}
