import { create } from "zustand";

import { formatDate, formatTime } from "@/app/helpers/format";

import type { DiffsCollection } from "@/types/analysis-diff";
import type { PriceList } from "@/types/pricelist";

type PriceListStore = {
  priceList?: PriceList;
  priceListDiffs?: DiffsCollection;
  getPriceListCount: () => number;
  getPriceSections: () => string[];
  getPriceListCreatedDate: () => string;
  getPriceListCreatedTime: () => string;
  getPriceListCity: () => string;
  updatePriceList: (priceList: PriceList) => void;
  updatePriceListDiffs: (diffs: DiffsCollection) => void;
};

export const usePriceListStore = create<PriceListStore>((set, get) => ({
  priceList: undefined,
  getPriceListCount: () => {
    const priceList = get().priceList;
    if (!priceList) return 0;
    return priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);
  },
  getPriceListCreatedDate: () => {
    const priceList = get().priceList;
    if (!priceList) return "";
    return formatDate(priceList.createdAt);
  },
  getPriceListCreatedTime: () => {
    const priceList = get().priceList;
    if (!priceList) return "";
    return formatTime(priceList.createdAt);
  },
  getPriceSections: () => {
    const priceList = get().priceList;
    if (!priceList) return [];
    return priceList.positions.map(position => position.title);
  },
  updatePriceList: priceList => {
    set(state => ({ ...state, priceList }));
  },
  updatePriceListDiffs: priceListDiffs => {
    set(state => ({ ...state, priceListDiffs }));
  },
  getPriceListCity: () => {
    const priceList = get().priceList;
    if (!priceList) return "";
    return priceList.city;
  }
}));
