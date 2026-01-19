import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import type { Goods } from "@/types/pricelist";

export const getMostCheapGoods = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `pricelist:mostcheapgoods:${String(city)}-${date}`;
  const cached = await cacheGet<Goods[]>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await getLastPriceList(city);
  if (!priceList) throw new Error("Price list not found");

  const flatCatalog = priceList.positions.flatMap(position => position.items.flat());

  const sortedByPrice = flatCatalog
    .filter(item => Number(item.price) && Number(item.price) > 0)
    .sort((a, b) => Number(a.price) - Number(b.price));

  await cacheAdd(key, JSON.stringify(sortedByPrice), { ex: 60 * 60 * 24 }); // 24 hours

  return sortedByPrice;
};
