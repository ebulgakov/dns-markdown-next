import { useContext } from "react";

import { CatalogComponentVariant } from "@/app/components/catalog/types";
import { UserContext } from "@/app/contexts/user-context";
import {
  getOptimizedFlatPriceListWithTitle,
  getOptimizedFlatTitles,
  getOptimizedFlatTitlesFromGoods,
  getOptimizedOutput
} from "@/app/helpers/pricelist";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";
import { UserSections } from "@/types/user";
import {
  VisualizationFoundTitle,
  VisualizationHeader,
  VisualizationNoFavsAlert,
  VisualizationOutputList
} from "@/types/visualization";

import type { PriceList as priceListType } from "@/types/pricelist";

type UseFilteredGoodsParams = {
  hiddenSections: UserSections;
  customSortSections?: UserSections;
  term: string;
  priceList: priceListType;
  variant: CatalogComponentVariant;
};

export const useFilteredGoods = ({
  term,
  priceList,
  hiddenSections,
  variant
}: UseFilteredGoodsParams): {
  flattenList: VisualizationOutputList;
  flattenTitles: VisualizationHeader[];
} => {
  const { favoriteSections } = useContext(UserContext);
  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  let flattenOptimizedPriceList = getOptimizedFlatPriceListWithTitle(priceList);
  let flattenTitles = getOptimizedFlatTitles(priceList);

  if (variant === "updates") {
    const flattenList = getOptimizedOutput(flattenOptimizedPriceList, flattenTitles, {
      favoriteSections,
      hiddenSections
    }).filter(title => title.type !== "title");

    return {
      flattenList,
      flattenTitles
    };
  }

  if (term.length > 2) {
    flattenOptimizedPriceList = flattenOptimizedPriceList.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    hiddenSections = [];
    flattenTitles = getOptimizedFlatTitlesFromGoods(flattenOptimizedPriceList);
  }

  if (sortGoods === "price") {
    flattenOptimizedPriceList = flattenOptimizedPriceList.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
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

    flattenOptimizedPriceList = [...withOldPrice, ...withoutOldPrice];
  } else if (sortGoods === "profit") {
    const profitableItems = flattenOptimizedPriceList.filter(
      item => Number(item.profit) && Number(item.profit) > 0
    );
    const nonProfitableItems = flattenOptimizedPriceList.filter(
      item => !Number(item.profit) || Number(item.profit) <= 0
    );
    profitableItems.sort((a, b) => Number(b.profit) - Number(a.profit));

    flattenOptimizedPriceList = [...profitableItems, ...nonProfitableItems];
  }

  const flattenList = getOptimizedOutput(flattenOptimizedPriceList, flattenTitles, {
    favoriteSections,
    hiddenSections
  });

  if (favoriteSections.length === 0 && term.length === 0) {
    const noFavsAlert: VisualizationNoFavsAlert = {
      type: "noFavsAlert"
    };

    flattenList.unshift(noFavsAlert);
  }

  if (term.length > 2) {
    const foundTitle: VisualizationFoundTitle = {
      type: "foundTitle"
    };

    flattenList.unshift(foundTitle);
  }

  return {
    flattenList,
    flattenTitles
  };
};
