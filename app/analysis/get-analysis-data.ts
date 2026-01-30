import { getUniqueAnalysisGoodsCount } from "@/db/analysis-data/queries";
import { getAllDiffsReportByCity } from "@/db/analysis-diff/queries";
import { getPriceListCity, getArchiveGoodsCount } from "@/db/pricelist/queries";
import { getAllReportsByCity } from "@/db/reports/queries";

import type { AnalysisDiffReport as AnalysisDiffReportType } from "@/types/analysis-diff";
import type { PriceListsArchiveCount } from "@/types/pricelist";
import type { ReportsResponse } from "@/types/reports";

export async function getAnalysisData() {
  let city: string;
  try {
    city = await getPriceListCity();
    if (!city) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("City not found", { cause: e });
  }

  let goodsCountByDates: PriceListsArchiveCount[];
  try {
    goodsCountByDates = await getArchiveGoodsCount(city);
    if (!goodsCountByDates) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Not able to get analyzed goods by date", { cause: e });
  }

  let goodsChangesByDates: AnalysisDiffReportType[];
  try {
    goodsChangesByDates = await getAllDiffsReportByCity(city);
    goodsChangesByDates.reverse();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods changes by dates not found", { cause: e });
  }

  let reports: ReportsResponse;
  try {
    reports = await getAllReportsByCity(city);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Reports data not found", { cause: e });
  }

  let countUniqueGoods: number;
  try {
    countUniqueGoods = await getUniqueAnalysisGoodsCount(city);
    if (countUniqueGoods == null) throw new Error(); // allow zero count
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods count not found", { cause: e });
  }

  return { city, goodsCountByDates, goodsChangesByDates, reports, countUniqueGoods };
}
