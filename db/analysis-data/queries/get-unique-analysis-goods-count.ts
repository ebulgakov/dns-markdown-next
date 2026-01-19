import { add as cacheAdd, get as cacheGet } from "@/cache";
import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { dbConnect } from "@/db/database";

export const getUniqueAnalysisGoodsCount = async (city: string, date: string): Promise<number> => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `analysis:uniq-count:${String(city)}-${date}`;
  const cached = await cacheGet<number>(key);
  if (cached) return cached;

  await dbConnect();

  const links = await getAnalysisGoodsLinks(city, date);
  const uniqueCount = links.length;

  await cacheAdd(key, String(uniqueCount), { ex: 60 * 60 * 24 }); // 24 hours

  return uniqueCount;
};
