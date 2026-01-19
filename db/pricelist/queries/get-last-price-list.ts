import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import type { PriceList as PriceListType } from "@/types/pricelist";

export const getLastPriceList = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `pricelist:last:${String(city)}`;
  const cached = await cacheGet<PriceListType>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await Pricelist.findOne({ city }, {}, { sort: { updatedAt: -1 } });

  if (!priceList) throw new Error("Price list not found");

  const plainPriceList = JSON.stringify(priceList);

  await cacheAdd(key, plainPriceList, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainPriceList) as PriceListType;
};
