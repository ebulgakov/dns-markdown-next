import makeDiff from "@/app/analysis/make-diff";
import { formatDate, formatDateShort } from "@/app/helpers/format";
import { getAnalysisGoodsLinks, getAnalysisGoodsByParam } from "@/db/analysis-data/queries";
import { getArchiveListDates, getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";

import type { AnalysisChangesByDates, AnalysisData } from "@/types/analysis-data";
import type { PriceListDates } from "@/types/pricelist";

export async function getAnalysisData() {
  let city: string | undefined;
  let links: string[] | undefined;
  let startFrom: string;
  let currentCountGoods: number;
  let archiveDatesCollection: PriceListDates;
  let goodsCountByDates: { date: string; count: number }[];
  let goodsChangesByDates: AnalysisChangesByDates;
  let goodsByDatesCollection: AnalysisData[][];

  try {
    city = await getPriceListCity();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить город прайс-листа", e);
  }

  try {
    links = await getAnalysisGoodsLinks(city);
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Не удалось получить ссылки на товары для анализа", e);
  }

  try {
    archiveDatesCollection = await getArchiveListDates(city);
    startFrom = formatDate(archiveDatesCollection[0].createdAt);
  } catch (e) {
    const error = e as Error;
    console.error(error);
    throw new Error("Не удалось получить архив прайс-листов", error);
  }

  try {
    const lastPriceList = await getLastPriceList(city);
    currentCountGoods = lastPriceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);
  } catch (e) {
    const error = e as Error;
    console.error(error);
    throw new Error("Не удалось получить последний прайс-лист", error);
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
  } catch (e) {
    const error = e as Error;
    console.error(error);
    throw new Error("Не удалось получить проанализированные товары по дате", error);
  }

  try {
    goodsChangesByDates = [];
    for (let i = 1; i < goodsByDatesCollection.length; i++) {
      const currentDateGoods = goodsByDatesCollection[i];
      const previousDateGoods = goodsByDatesCollection[i - 1];
      const diff = makeDiff(currentDateGoods, previousDateGoods);

      goodsChangesByDates.push({
        date: formatDateShort(archiveDatesCollection[i].createdAt),
        pricesChanged: diff.changesPrice.length,
        profitChanged: diff.changesProfit.length,
        new: diff.newItems.length,
        sold: diff.removedItems.length
      });
    }
  } catch (e) {
    const error = e as Error;
    console.error(error);
    throw new Error("Не удалось получить динамику товаров по дате", error);
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
