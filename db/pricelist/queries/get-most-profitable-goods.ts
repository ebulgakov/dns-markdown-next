import { getFlatPriceList } from "@/app/helpers/pricelist";
import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import type { Goods } from "@/types/pricelist";

export const getMostProfitableGoods = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `pricelist:mostprofitablegoods:${String(city)}-${date}`;
  const cached = await cacheGet<Goods[]>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await getLastPriceList(city);
  if (!priceList) throw new Error("Price list not found");

  const flatCatalog = getFlatPriceList(priceList);
  const profitableItems = flatCatalog.filter(
    item => Number(item.profit) && Number(item.profit) > 0
  );
  const nonProfitableItems = flatCatalog.filter(
    item => !Number(item.profit) || Number(item.profit) <= 0
  );
  profitableItems.sort((a, b) => Number(b.profit) - Number(a.profit));

  const sortedByProfit = [...profitableItems, ...nonProfitableItems];
  await cacheAdd(key, JSON.stringify(sortedByProfit), { ex: 60 * 60 * 24 }); // 24 hours

  // Placeholder implementation
  return sortedByProfit;
};
