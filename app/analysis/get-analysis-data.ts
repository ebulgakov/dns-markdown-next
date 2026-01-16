import { formatDate, formatDateShort } from "@/app/helpers/format";
import { getAnalysisGoodsLinks, getAnalysisGoodsByParam } from "@/db/analysis-data/queries";
import { getAllDiffsByCity } from "@/db/analysis-diff/queries";
import { getArchiveListDates, getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";
import { getAllReportsByCity } from "@/db/reports/queries";

import type { AnalysisData } from "@/types/analysis-data";
import type { AnalysisDiff as AnalysisDiffType } from "@/types/analysis-diff";
import type { PriceListDates } from "@/types/pricelist";
import type { ReportsResponse } from "@/types/reports";

export async function getAnalysisData() {
  let city: string | undefined;
  let links: string[] | undefined;
  let startFrom: string;
  let currentCountGoods: number;
  let archiveDatesCollection: PriceListDates;
  let goodsCountByDates: { date: string; count: number }[];
  let goodsChangesByDates: AnalysisDiffType[];
  let goodsByDatesCollection: AnalysisData[][];
  let reports: ReportsResponse;

  try {
    city = await getPriceListCity();
    if (!city) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("City not found", { cause: e });
  }

  try {
    links = await getAnalysisGoodsLinks(city);
    if (!links) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods links not found", { cause: e });
  }

  try {
    archiveDatesCollection = await getArchiveListDates(city);
    if (!archiveDatesCollection || archiveDatesCollection.length === 0) throw new Error();
    startFrom = formatDate(archiveDatesCollection[0].createdAt);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Archive of price lists not found", { cause: e });
  }

  try {
    const lastPriceList = await getLastPriceList(city);
    if (!lastPriceList) throw new Error();
    currentCountGoods = lastPriceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Price list not found", { cause: e });
  }

  try {
    const promises = archiveDatesCollection.map(dateItem =>
      getAnalysisGoodsByParam({
        param: "dateAdded",
        value: dateItem.createdAt,
        city
      })
    );
    goodsByDatesCollection = await Promise.all(promises);
    if (!goodsByDatesCollection || goodsByDatesCollection.length === 0) throw new Error();

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

  try {
    goodsChangesByDates = await getAllDiffsByCity(city);
    if (!goodsChangesByDates) throw new Error();

    goodsChangesByDates.reverse();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Analysis goods changes by dates not found", { cause: e });
  }

  try {
    reports = await getAllReportsByCity(city);
    if (!reports || reports.length === 0) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Reports data not found", { cause: e });
  }

  return {
    city,
    countUniqueGoods: links.length,
    startFrom,
    currentCountGoods,
    goodsCountByDates,
    goodsChangesByDates,
    reports
  };
}
