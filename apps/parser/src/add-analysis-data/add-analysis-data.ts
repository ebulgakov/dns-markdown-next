import { api } from "@src/api/client";
import { env } from "@src/env";

import generateGoodsCollection from "./helpers/generate-goods-collection";

export async function addAnalysisData() {
  const writeStrategy = env.WRITE_STRATEGY;
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  const options: {
    city: string;
    limit?: number;
  } = {
    city,
    ...(writeStrategy === "insert" ? { limit: 2 } : {})
  };

  const priceListsCollections = await api.service.getAllPriceLists(options);

  let usedPriceLists = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    await api.service.deleteAllAnalysisData(city);
  } else {
    usedPriceLists = priceListsCollections.slice(0, 1);
    if (usedPriceLists[0])
      await api.service.deleteAnalysisByDateData({ date: usedPriceLists[0].createdAt, city });
  }

  const data = generateGoodsCollection(usedPriceLists, city);
  await api.service.addManyAnalysisData({ analysisData: data });
}
