type Reason = {
  _id: string;
  label: string;
  text: string;
};

export type Position = {
  _id: string;
  title: string;
  items: Goods[];
};

export interface Goods {
  _id: string;
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
  _id: string;
  city: string;
  positions: Position[];
  createdAt: string;
}

export type PriceListDate = {
  _id: string;
  createdAt: string;
};

export type PriceListsArchiveCount = { date: string; count: number };
