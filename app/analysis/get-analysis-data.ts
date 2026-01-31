import {
  getPriceListCity,
  getLast30ArchiveProductsCount,
  getLast30DiffsReportByCity,
  getLast30ReportsByCity,
  getTotalUniqProductsCount
} from "@/api";

import type { AnalysisDiffReport as AnalysisDiffReportType } from "@/types/analysis-diff";
import type { PriceListsArchiveCount } from "@/types/pricelist";
import type { ReportsResponse } from "@/types/reports";

export async function getAnalysisData() {
  const city = await getPriceListCity();

  let goodsCountByDates: PriceListsArchiveCount[];
  try {
    goodsCountByDates = await getLast30ArchiveProductsCount(city);
    if (!goodsCountByDates) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Not able to get analyzed goods by date", { cause: e });
  }

  let goodsChangesByDates: AnalysisDiffReportType[];
  try {
    goodsChangesByDates = await getLast30DiffsReportByCity(city);
    goodsChangesByDates.reverse();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods changes by dates not found", { cause: e });
  }

  let reports: ReportsResponse;
  try {
    reports = await getLast30ReportsByCity(city);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Reports data not found", { cause: e });
  }

  let countUniqueGoods: number;
  try {
    countUniqueGoods = await getTotalUniqProductsCount(city);
    if (countUniqueGoods == null) throw new Error(); // allow zero count
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods count not found", { cause: e });
  }

  return { city, goodsCountByDates, goodsChangesByDates, reports, countUniqueGoods };
}
