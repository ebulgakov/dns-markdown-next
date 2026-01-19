import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { Pricelist } from "@/db/models/pricelist-model";

import type { PriceListDate } from "@/types/pricelist";

export const getArchiveListDates = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `pricelist:archive:${String(city)}-${date}`;
  const cached = await cacheGet<PriceListDate[]>(key);
  if (cached) return cached;

  await dbConnect();

  const priceLists = await Pricelist.find({ city }, {}, { sort: { updatedAt: 1 } }).select(
    "createdAt"
  );
  if (!priceLists) throw new Error("No archived price lists found");

  const plainPriceLists = JSON.stringify(priceLists);

  await cacheAdd(key, plainPriceLists, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainPriceLists) as PriceListDate[];
};
