import { getLastPriceList } from "@/api";
import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";

export const getLastPriceListDate = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `pricelist:last-date:${String(city)}`;
  const cached = await cacheGet<string>(key);
  if (cached) return cached;

  await dbConnect();

  const priceList = await getLastPriceList(city);

  if (!priceList) throw new Error("Price list not found");

  const lastDate = String(priceList.createdAt);

  await cacheAdd(key, lastDate, { ex: 60 * 60 * 24 }); // 24 hours

  return lastDate;
};
