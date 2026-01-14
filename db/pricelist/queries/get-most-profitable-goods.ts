import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import type { Goods } from "@/types/pricelist";

export const getMostProfitableGoods = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `pricelist:mostprofitablegoods:${String(city)}`;
  const cached = await cacheGet<Goods[]>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await getLastPriceList(city);
  if (!priceList) throw new Error("Price list not found");

  const flatCatalog = priceList.positions.flatMap(position => position.items.flat());
  const profitableItems = flatCatalog.filter(
    item => Number(item.profit) && Number(item.profit) > 0
  );
  const nonProfitableItems = flatCatalog.filter(
    item => !Number(item.profit) || Number(item.profit) <= 0
  );
  profitableItems.sort((a, b) => Number(b.profit) - Number(a.profit));

  const sortedByProfit = [...profitableItems, ...nonProfitableItems];
  await cacheAdd(key, JSON.stringify(sortedByProfit));

  // Placeholder implementation
  return sortedByProfit;
};
