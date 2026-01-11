import redis from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import type { PriceList as PriceListType } from "@/types/pricelist";

export const getLastPriceList = async (city: string) => {
  const key = `pricelist:last:${String(city)}`;
  const cached = await redis.get(key);
  if (cached) return cached as PriceListType;

  await dbConnect();

  const priceList = await Pricelist.findOne({ city }, {}, { sort: { updatedAt: -1 } });

  if (!priceList) throw new Error("Price list not found");

  const plainPriceList = JSON.stringify(priceList);

  await redis.set(key, plainPriceList);

  return JSON.parse(plainPriceList) as PriceListType;
};
