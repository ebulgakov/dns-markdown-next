import type { Goods, PriceList } from "../../types/pricelist.ts";

export default function getRemovedGoods(last: PriceList, prev: PriceList): Goods[] {
  const flatLastCatalog = last.positions.flatMap(position => position.items.flat());
  const flatPrevCatalog = prev.positions.flatMap(position => position.items.flat());
  const removedGoods: Goods[] = [];

  for (const prevItem of flatPrevCatalog) {
    const isItemInLast = flatLastCatalog.find(lastItem => lastItem.link === prevItem.link);
    if (!isItemInLast) removedGoods.push(prevItem);
  }

  return removedGoods;
}
