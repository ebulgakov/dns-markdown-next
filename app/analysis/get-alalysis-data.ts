import { formatDate } from "@/app/helpers/format";
import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { getArchiveListDates, getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";

export async function getAnalysisData() {
  let city: string | undefined;
  let links: string[] | undefined;
  let startFrom: string;
  let currentCountGoods: number;

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
    const archiveCollection = await getArchiveListDates(city);
    startFrom = formatDate(archiveCollection[0]?.createdAt);
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

  return { city, countUniqueGoods: links.length, startFrom, currentCountGoods };
}
