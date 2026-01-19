import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { AnalysisDiff } from "@/db/models/analysis-diff-model";
import { AnalysisDiff as AnalysisDiffType, AnalysisDiffReport } from "@/types/analysis-diff";

export const getAllDiffsReportByCity = async (city: string, date: string) => {
  if (!city || !date) throw new Error("city|date is required");

  const key = `analysisdiffreport:all:${String(city)}-${date}`;
  const cached = await cacheGet<AnalysisDiffReport[]>(key);
  if (cached) return cached;

  await dbConnect();

  const diffs = (await AnalysisDiff.find(
    { city },
    {},
    { sort: { dateAdded: -1 } }
  )) as AnalysisDiffType[];

  const report: AnalysisDiffReport[] = [];

  diffs.forEach(diff => {
    report.push({
      ...diff,
      newItems: diff.newItems.length,
      removedItems: diff.removedItems.length,
      changesPrice: diff.changesPrice.length,
      changesProfit: diff.changesProfit.length
    });
  });

  const plainDiffs = JSON.stringify(report);

  await cacheAdd(key, plainDiffs, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainDiffs) as AnalysisDiffReport[];
};
