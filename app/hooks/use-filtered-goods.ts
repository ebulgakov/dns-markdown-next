import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import type { Goods as GoodsType, PriceList as priceListType } from "@/types/pricelist";

export const useFilteredGoods = (term: string, priceList: priceListType): GoodsType[] => {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);

  if (term.length > 1 || sortGoods !== "default") {
    const flatCatalog = priceList.positions.flatMap(position => position.items.flat());
    const filteredArray = flatCatalog.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    if (sortGoods === "price") {
      filteredArray.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortGoods === "discount") {
      filteredArray.sort(
        (a, b) =>
          (Number(a.price) * 100) / Number(a.priceOld) -
          (Number(b.price) * 100) / Number(b.priceOld)
      );
    }

    if (sortGoods === "profit") {
      filteredArray.sort((a, b) => Number(b.profit) - Number(a.profit));
    }

    return filteredArray;
  } else {
    return [];
  }
};
