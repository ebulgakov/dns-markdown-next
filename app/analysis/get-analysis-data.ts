import { formatDate, formatDateShort } from "@/app/helpers/format";
import { getAnalysisGoodsLinks, getAnalysisGoodsByParam } from "@/db/analysis-data/queries";
import { getAllDiffsByCity } from "@/db/analysis-diff/queries/get-all-diffs-by-city";
import { getArchiveListDates, getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";

import type { AnalysisData } from "@/types/analysis-data";
import type { AnalysisDiff as AnalysisDiffType } from "@/types/analysis-diff";
import type { PriceListDates } from "@/types/pricelist";

export async function getAnalysisData() {
  let city: string | undefined;
  let links: string[] | undefined;
  let startFrom: string;
  let currentCountGoods: number;
  let archiveDatesCollection: PriceListDates;
  let goodsCountByDates: { date: string; count: number }[];
  let goodsChangesByDates: AnalysisDiffType[];
  let goodsByDatesCollection: AnalysisData[][];

  try {
    city = await getPriceListCity();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить город прайс-листа", { cause: e });
  }

  try {
    links = await getAnalysisGoodsLinks(city);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить ссылки на товары для анализа", { cause: e });
  }

  try {
    archiveDatesCollection = await getArchiveListDates(city);
    startFrom = formatDate(archiveDatesCollection[0].createdAt);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить архив прайс-листов", { cause: e });
  }

  try {
    const lastPriceList = await getLastPriceList(city);
    currentCountGoods = lastPriceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить последний прайс-лист", { cause: e });
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

    goodsCountByDates = archiveDatesCollection.map((date, idx) => {
      return {
        date: formatDateShort(date.createdAt),
        count: goodsByDatesCollection[idx].length
      };
    });
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить проанализированные товары по дате", { cause: e });
  }

  try {
    goodsChangesByDates = await getAllDiffsByCity(city);
    goodsChangesByDates.reverse();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить динамику товаров по дате", { cause: e });
  }

  return {
    city,
    countUniqueGoods: links.length,
    startFrom,
    currentCountGoods,
    goodsCountByDates,
    goodsChangesByDates
  };
}
