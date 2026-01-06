import type { Goods, PriceList } from "../../types/pricelist.ts";

export default function getRemovedGoods(
  last: PriceList,
  prev: PriceList
): { removedGoods: Goods[]; addedGoods: Goods[] } {
  const flatLastCatalog = last.positions.flatMap(position => position.items.flat());
  const flatPrevCatalog = prev.positions.flatMap(position => position.items.flat());
  const removedGoods: Goods[] = [];
  const addedGoods: Goods[] = [];

  for (const prevItem of flatPrevCatalog) {
    const isItemInLast = flatLastCatalog.find(lastItem => lastItem.link === prevItem.link);
    if (!isItemInLast) removedGoods.push(prevItem);
  }

  for (const lastItem of flatLastCatalog) {
    const isItemInPrev = flatPrevCatalog.find(prevItem => prevItem.link === lastItem.link);
    if (!isItemInPrev) addedGoods.push(lastItem);
  }

  return { removedGoods, addedGoods };
}
