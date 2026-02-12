import { useDebounce } from "@uidotdev/usehooks";
import Fuse from "fuse.js";
import { useContext } from "react";

import { UserContext } from "@/app/contexts/user-context";
import {
  getOptimizedFlatPriceListWithTitle,
  getOptimizedFlatTitles,
  getOptimizedFlatTitlesFromGoods,
  getOptimizedOutput
} from "@/app/helpers/pricelist";
import { usePriceListStore } from "@/app/stores/pricelist-store";
import { useSearchStore } from "@/app/stores/search-store";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";
import {
  VisualizationFoundTitle,
  VisualizationHeader,
  VisualizationNoFavsAlert,
  VisualizationOutputList
} from "@/types/visualization";

type UseFilteredGoodsParams = {
  hasNoModifyOutput?: boolean;
};

export const useFilteredGoods = ({
  hasNoModifyOutput
}: UseFilteredGoodsParams): {
  flattenList: VisualizationOutputList;
  flattenTitles: VisualizationHeader[];
} => {
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debounceSearchTerm = useDebounce<string>(searchTerm.trim(), 100);
  const priceList = usePriceListStore(state => state.priceList);
  const { favoriteSections, hiddenSections: initialHiddenSections } = useContext(UserContext);
  let hiddenSections = initialHiddenSections;
  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  if (!priceList) {
    return {
      flattenList: [],
      flattenTitles: []
    };
  }

  let flattenOptimizedPriceList = getOptimizedFlatPriceListWithTitle(priceList);
  let flattenTitles = getOptimizedFlatTitles(priceList);

  if (hasNoModifyOutput) {
    const flattenList = getOptimizedOutput(flattenOptimizedPriceList, flattenTitles, {
      favoriteSections,
      hiddenSections
    });

    return {
      flattenList,
      flattenTitles
    };
  }

  if (debounceSearchTerm.length > 0) {
    const fuse = new Fuse(flattenOptimizedPriceList, {
      keys: ["title", "titleInvertTranslation"]
    });

    flattenOptimizedPriceList = fuse
      .search(debounceSearchTerm.toLowerCase())
      .map(result => result.item);

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

  if (debounceSearchTerm.length > 0) {
    const foundTitle: VisualizationFoundTitle = {
      type: "foundTitle",
      titles: flattenTitles.map(title => title.title),
      goodsCount: flattenList.filter(item => item.type === "goods").length
    };

    flattenList.unshift(foundTitle);
  } else if (favoriteSections.length === 0) {
    const noFavsAlert: VisualizationNoFavsAlert = {
      type: "noFavsAlert"
    };

    flattenList.unshift(noFavsAlert);
  }

  return {
    flattenList,
    flattenTitles
  };
};
