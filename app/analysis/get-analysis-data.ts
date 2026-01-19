import { formatDateShort } from "@/app/helpers/format";
import { getUniqueAnalysisGoodsCount, getAnalysisGoodsByParam } from "@/db/analysis-data/queries";
import { getAllDiffsByCity } from "@/db/analysis-diff/queries";
import { getArchiveListDates, getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";
import { getAllReportsByCity } from "@/db/reports/queries";

import type { AnalysisDiff as AnalysisDiffType } from "@/types/analysis-diff";
import type { PriceList } from "@/types/pricelist";
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

  let lastPriceList: PriceList | undefined;
  try {
    lastPriceList = await getLastPriceList(city);
    if (!lastPriceList) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Price list not found", { cause: e });
  }

  let goodsCountByDates: { date: string; count: number }[];
  try {
    const archiveDatesCollection = await getArchiveListDates(city);
    const promises = archiveDatesCollection.map(dateItem =>
      getAnalysisGoodsByParam({
        param: "dateAdded",
        value: dateItem.createdAt,
        city
      })
    );
    const goodsByDatesCollection = await Promise.all(promises);
    goodsCountByDates = archiveDatesCollection.map((date, idx) => {
      return {
        date: formatDateShort(date.createdAt),
        count: goodsByDatesCollection[idx].length
      };
    });
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Not able to get analyzed goods by date", { cause: e });
  }

  let goodsChangesByDates: AnalysisDiffType[];
  try {
    goodsChangesByDates = await getAllDiffsByCity(city);
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
    if (!countUniqueGoods) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods count not found", { cause: e });
  }

  return { city, goodsCountByDates, goodsChangesByDates, reports, countUniqueGoods };
}
