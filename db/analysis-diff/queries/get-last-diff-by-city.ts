import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { AnalysisDiff } from "@/db/models/analysis-diff-model";
import { AnalysisDiff as AnalysisDiffType } from "@/types/analysis-diff";

export const getLastDiffByCity = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `analysisdiff:last:${String(city)}-${date}`;
  const cached = await cacheGet<AnalysisDiffType>(key);
  if (cached) return cached;

  await dbConnect();

  const diff = await AnalysisDiff.findOne({ city }, {}, { sort: { dateAdded: -1 } });
  if (!diff) throw new Error("No analysis diffs found");

  const plainDiff = JSON.stringify(diff);

  await cacheAdd(key, plainDiff, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainDiff) as AnalysisDiffType;
};
