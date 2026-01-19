import { getFlatPriceList } from "@/app/helpers/pricelist";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import type { Goods as GoodsType, PriceList as priceListType } from "@/types/pricelist";

export const useFilteredGoods = (term: string, priceList: priceListType): GoodsType[] => {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  if (term.length > 1 || sortGoods !== "default") {
    const flatCatalog = getFlatPriceList(priceList);
    let filteredArray = flatCatalog.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    if (sortGoods === "price") {
      filteredArray.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortGoods === "discount") {
      const withOldPrice = filteredArray.filter(
        item => Number(item.priceOld) && Number(item.priceOld) > 0
      );
      const withoutOldPrice = filteredArray.filter(
        item => !Number(item.priceOld) || Number(item.priceOld) <= 0
      );
      withOldPrice.sort(
        (a, b) =>
          (Number(a.price) * 100) / Number(a.priceOld) -
          (Number(b.price) * 100) / Number(b.priceOld)
      );
      filteredArray = [...withOldPrice, ...withoutOldPrice];
    }

    if (sortGoods === "profit") {
      const profitableItems = filteredArray.filter(
        item => Number(item.profit) && Number(item.profit) > 0
      );
      const nonProfitableItems = filteredArray.filter(
        item => !Number(item.profit) || Number(item.profit) <= 0
      );
      profitableItems.sort((a, b) => Number(b.profit) - Number(a.profit));
      filteredArray = [...profitableItems, ...nonProfitableItems];
    }

    return filteredArray;
  } else {
    return [];
  }
};
