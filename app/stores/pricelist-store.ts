import { create } from "zustand";

import { formatDate, formatTime } from "@/app/helpers/format";
import { PriceList } from "@/types/pricelist";

type PriceListStore = {
  priceList?: PriceList;
  getPriceListCount: () => number;
  getPriceListCreatedDate: () => string;
  getPriceListCreatedTime: () => string;
  updatePriceList: (priceList: PriceList) => void;
};

export const usePriceListStore = create<PriceListStore>(set => ({
  priceList: undefined,
  getPriceListCount: () => {
    const priceList = usePriceListStore.getState().priceList;
    if (!priceList) return 0;
    return priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);
  },
  getPriceListCreatedDate: () => {
    const priceList = usePriceListStore.getState().priceList;
    if (!priceList) return "";
    return formatDate(priceList.createdAt);
  },
  getPriceListCreatedTime: () => {
    const priceList = usePriceListStore.getState().priceList;
    if (!priceList) return "";
    return formatTime(priceList.createdAt);
  },
  updatePriceList: priceList => {
    set(state => ({ ...state, priceList }));
  }
}));
