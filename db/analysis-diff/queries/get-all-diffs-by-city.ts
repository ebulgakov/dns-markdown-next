import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { AnalysisDiff } from "@/db/models/analysis-diff-model";
import { AnalysisDiff as AnalysisDiffType } from "@/types/analysis-diff";

export const getAllDiffsByCity = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `analysisdiff:all:${String(city)}`;
  const cached = await cacheGet<AnalysisDiffType[]>(key);
  if (cached) return cached;

  await dbConnect();

  const diffs = await AnalysisDiff.find({ city }, {}, { sort: { dateAdded: -1 } });
  if (!diffs) throw new Error("No analysis diffs found");

  const plainDiffs = JSON.stringify(diffs);

  await cacheAdd(key, plainDiffs);

  return JSON.parse(plainDiffs) as AnalysisDiffType[];
};
