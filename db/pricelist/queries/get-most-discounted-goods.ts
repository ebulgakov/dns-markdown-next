import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import type { Goods } from "@/types/pricelist";

export const getMostDiscountedGoods = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `pricelist:mostdiscountedgoods:${String(city)}`;
  const cached = await cacheGet<Goods[]>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await getLastPriceList(city);
  if (!priceList) throw new Error("Price list not found");

  const flatCatalog = priceList.positions.flatMap(position => position.items.flat());

  const sortedByDiscount = flatCatalog
    .filter(item => Number(item.price) && Number(item.price) > 0)
    .filter(item => Number(item.priceOld) && Number(item.priceOld) > 0)
    .sort(
      (a, b) =>
        (Number(a.price) * 100) / Number(a.priceOld) - (Number(b.price) * 100) / Number(b.priceOld)
    );

  await cacheAdd(key, JSON.stringify(sortedByDiscount));

  return sortedByDiscount;
};
