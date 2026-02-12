import { create } from "zustand";

import { formatDate, formatTime } from "@/app/helpers/format";
import { UserSections } from "@/types/user";

import type { DiffsCollection } from "@/types/analysis-diff";
import type { PriceList } from "@/types/pricelist";

export type PriceListStore = {
  priceList?: PriceList;
  priceListDiffs?: DiffsCollection;
  getPriceListCount: () => number;
  getPriceListSections: (favoriteSections: UserSections, hiddenSections: UserSections) => string[];
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
  getPriceListSections: (favoriteSections, hiddenSections) => {
    const priceListSections = get().priceList?.positions.map(position => position.title) || [];

    return priceListSections.sort((a, b) => {
      const isHiddenA = hiddenSections.includes(a);
      const isHiddenB = hiddenSections.includes(b);
      const isFavoriteA = favoriteSections.includes(a);
      const isFavoriteB = favoriteSections.includes(b);

      if (isFavoriteA && !isFavoriteB) return -1;
      if (!isFavoriteA && isFavoriteB) return 1;

      if (isHiddenA && !isHiddenB) return 1;
      if (!isHiddenA && isHiddenB) return -1;

      return a.localeCompare(b);
    });
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
