import type { Goods as GoodsType, PriceList as priceListType } from "@/types/pricelist";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";
import { useSearchStore } from "@/app/stores/search-store";

export const useFilteredGoods = (priceList: priceListType): GoodsType[] => {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
  const searchTerm = useSearchStore(state => state.searchTerm);

  if (searchTerm.length > 1 || sortGoods !== "default") {
    const flatCatalog = priceList.positions.flatMap(position => position.items.flat());
    const filteredArray = flatCatalog.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
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
