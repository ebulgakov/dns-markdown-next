import { create } from "zustand";
import type { SortGoodsOptions } from "@/types/common";

type SortGoodsStore = {
  sortGoods: SortGoodsOptions;
  updateSortGoods: (sort: SortGoodsOptions) => void;
};
export const useSortGoodsStore = create<SortGoodsStore>(set => ({
  sortGoods: "default",
  updateSortGoods: (sort: SortGoodsOptions) => {
    set(state => ({ ...state, sortGoods: sort }));
  }
}));
