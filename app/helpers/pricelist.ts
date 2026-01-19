import type { PriceList } from "@/types/pricelist";

export const getFlatPriceList = (priceList: PriceList) => {
  return priceList.positions.flatMap(position => position.items);
};
