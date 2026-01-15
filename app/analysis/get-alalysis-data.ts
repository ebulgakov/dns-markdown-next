import { getAnalysisGoodsLinks } from "@/db/analysis-data/queries/get-analysis-goods-links";
import { getArchiveList, getPriceListCity } from "@/db/pricelist/queries";

export async function getAnalysisData() {
  let city: string | undefined;
  let links: string[] | undefined;
  let archiveCollection;

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
    archiveCollection = await getArchiveList(city);
  } catch (e) {
    const error = e as Error;
    console.error(error);
    throw new Error("Не удалось получить архив прайс-листов", error);
  }

  return { city, countUniqueGoods: links.length, archiveCollection };
}
