import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { Reports } from "@/db/models/reports-model";
import { ReportsResponse } from "@/types/reports";

export const getAllReportsByCity = async (city: string) => {
  if (!city) throw new Error("city is required");

  const key = `analytics-reports:all:${String(city)}`;
  const cached = await cacheGet<ReportsResponse>(key);
  if (cached) return cached;

  await dbConnect();

  const diffs = (await Reports.find({ city }, {}, { sort: { dateAdded: -1 } })) as ReportsResponse;

  const plainDiffs = JSON.stringify(diffs);

  await cacheAdd(key, plainDiffs, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainDiffs) as ReportsResponse;
};
