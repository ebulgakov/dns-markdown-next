import { add as cacheAdd, get as cacheGet } from "@/cache";
import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { dbConnect } from "@/db/database";

export const getUniqueAnalysisGoodsCount = async (city: string): Promise<number> => {
  if (!city) throw new Error("city is required");

  const key = `analysis:uniq-count:${String(city)}`;
  const cached = await cacheGet<number>(key);
  if (cached !== null && cached !== undefined) return cached; // allow zero count

  await dbConnect();

  const links = await getAnalysisGoodsLinks(city);
  const uniqueCount = links.length;

  await cacheAdd(key, String(uniqueCount), { ex: 60 * 60 * 24 }); // 24 hours

  return uniqueCount;
};
