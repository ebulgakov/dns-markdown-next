import { getFlatPriceList } from "@/app/helpers/pricelist";
import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import type { Goods } from "@/types/pricelist";

export const getMostDiscountedGoods = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `pricelist:mostdiscountedgoods:${String(city)}-${date}`;
  const cached = await cacheGet<Goods[]>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await getLastPriceList(city);
  if (!priceList) throw new Error("Price list not found");

  const flatCatalog = getFlatPriceList(priceList);

  const withOldPrice = flatCatalog.filter(
    item => Number(item.priceOld) && Number(item.priceOld) > 0
  );
  const withoutOldPrice = flatCatalog.filter(
    item => !Number(item.priceOld) || Number(item.priceOld) <= 0
  );
  withOldPrice.sort(
    (a, b) =>
      (Number(a.price) * 100) / Number(a.priceOld) - (Number(b.price) * 100) / Number(b.priceOld)
  );

  const sortedByDiscount = [...withOldPrice, ...withoutOldPrice];
  await cacheAdd(key, JSON.stringify(sortedByDiscount), { ex: 60 * 60 * 24 }); // 24 hours

  return sortedByDiscount;
};
