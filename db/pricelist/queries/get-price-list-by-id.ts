import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import type { PriceList as PriceListType } from "@/types/pricelist";

export const getPriceListById = async (id: string) => {
  if (!id) throw new Error("id is required");

  const key = `pricelist:archiveid:${String(id)}`;
  const cached = await cacheGet<PriceListType>(key);
  if (cached) return cached;

  await dbConnect();
  const priceList = await Pricelist.findOne({ _id: id });

  if (!priceList) throw new Error("Price list not found");

  const plainPriceList = JSON.stringify(priceList);

  await cacheAdd(key, plainPriceList);

  return JSON.parse(plainPriceList) as PriceListType;
};
