import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import type { PriceListDates } from "@/types/pricelist";

export const getArchiveListDates = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `pricelist:archive:${String(city)}`;
  const cached = await cacheGet<PriceListDates>(key);
  if (cached) return cached;

  await dbConnect();

  const priceLists = await Pricelist.find({ city }, {}, { sort: { updatedAt: 1 } }).select(
    "createdAt"
  );
  if (!priceLists) throw new Error("No archived price lists found");

  const plainPriceLists = JSON.stringify(priceLists);

  await cacheAdd(key, plainPriceLists);

  return JSON.parse(plainPriceLists) as PriceListDates;
};
