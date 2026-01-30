import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { AnalysisData } from "@/db/models/analysis-data-model";

export const getAnalysisGoodsLinks = async (city: string): Promise<string[]> => {
  if (!city) throw new Error("city is required");

  const key = `analysis:links:${String(city)}`;
  const cached = await cacheGet<string[]>(key);
  if (cached) return cached;

  await dbConnect();

  const data = await AnalysisData.find({ city }, {}, { sort: { updatedAt: 1 } }).select("link");
  const links = data.map(item => item.link) as string[];
  const uniqueLinks = Array.from(new Set(links));
  const plainLinks = JSON.stringify(uniqueLinks);

  await cacheAdd(key, plainLinks, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainLinks);
};
