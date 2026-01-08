import type { Goods as GoodsType, PriceList as priceListType } from "@/types/pricelist";
import type { SortGoodsOptions } from "@/types/common";

export const useFilteredGoods = (
  term: string,
  priceList: priceListType,
  sort: SortGoodsOptions
): GoodsType[] => {
  if (term.length > 1 || sort !== "default") {
    const flatCatalog = priceList.positions.flatMap(position => position.items.flat());
    const filteredArray = flatCatalog.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );

    if (sort === "price") {
      filteredArray.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "discount") {
      filteredArray.sort(
        (a, b) =>
          (Number(a.price) * 100) / Number(a.priceOld) -
          (Number(b.price) * 100) / Number(b.priceOld)
      );
    }

    if (sort === "profit") {
      filteredArray.sort((a, b) => Number(b.profit) - Number(a.profit));
    }

    return filteredArray;
  } else {
    return [];
  }
};
