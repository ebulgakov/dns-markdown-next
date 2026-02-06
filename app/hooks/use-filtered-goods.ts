import { useContext } from "react";

import { UserContext } from "@/app/contexts/user-context";
import {
  getOptimizedFlatPriceListWithTitle,
  getOptimizedFlatTitles,
  getOptimizedOutput
} from "@/app/helpers/pricelist";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";
import { UserSections } from "@/types/user";
import { VisualizationOutputList } from "@/types/visualization";

import type { PriceList as priceListType } from "@/types/pricelist";

export const useFilteredGoods = (
  term: string,
  priceList: priceListType,
  { hiddenSections: extendedHiddenSections }: { hiddenSections: UserSections }
): VisualizationOutputList => {
  const { favoriteSections, hiddenSections: userHiddenSections } = useContext(UserContext);
  const hiddenSections = Array.from(new Set([...userHiddenSections, ...extendedHiddenSections]));

  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  const flattenOptimizedPriceList = getOptimizedFlatPriceListWithTitle(priceList);

  if (sortGoods === "default" && term.length <= 2) {
    const flattenOptimizedTitles = getOptimizedFlatTitles(priceList);
    return getOptimizedOutput(flattenOptimizedPriceList, flattenOptimizedTitles, {
      favoriteSections,
      hiddenSections
    });
  }

  if (term.length > 2) {
    return flattenOptimizedPriceList.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  } else if (sortGoods === "price") {
    return flattenOptimizedPriceList.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortGoods === "discount") {
    const withOldPrice = flattenOptimizedPriceList.filter(
      item => Number(item.priceOld) && Number(item.priceOld) > 0
    );
    const withoutOldPrice = flattenOptimizedPriceList.filter(
      item => !Number(item.priceOld) || Number(item.priceOld) <= 0
    );
    withOldPrice.sort(
      (a, b) =>
        (Number(a.price) * 100) / Number(a.priceOld) - (Number(b.price) * 100) / Number(b.priceOld)
    );
    return [...withOldPrice, ...withoutOldPrice];
  } else if (sortGoods === "profit") {
    const profitableItems = flattenOptimizedPriceList.filter(
      item => Number(item.profit) && Number(item.profit) > 0
    );
    const nonProfitableItems = flattenOptimizedPriceList.filter(
      item => !Number(item.profit) || Number(item.profit) <= 0
    );
    profitableItems.sort((a, b) => Number(b.profit) - Number(a.profit));
    return [...profitableItems, ...nonProfitableItems];
  }

  return [];
};
