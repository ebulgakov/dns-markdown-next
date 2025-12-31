import type { Goods as GoodsType, PriceList as priceListType } from "@/types/pricelist";

export const useFilteredGoods = (term: string, priceList: priceListType): GoodsType[] => {
  if (term.length > 1) {
    const flatCatalog = priceList.positions.flatMap(position => position.items.flat());
    return flatCatalog.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
  } else {
    return [];
  }
};
