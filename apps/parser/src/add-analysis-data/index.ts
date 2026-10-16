import { getAllPriceLists } from "@src/api/get";
import {
  deleteAllAnalysisData,
  deleteAnalysisByDateData,
  addManyAnalysisData
} from "@src/api/post";
import { env } from "@src/env";
import getPerformance from "@src/helpers/get-performance";

import generateGoodsCollection from "./helpers/generate-goods-collection";

async function addAnalysisData() {
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

  const priceListsCollections = await getAllPriceLists(options);

  let usedPriceLists = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    await deleteAllAnalysisData(city);
  } else {
    usedPriceLists = priceListsCollections.slice(0, 1);
    if (usedPriceLists[0])
      await deleteAnalysisByDateData({ date: usedPriceLists[0].createdAt, city });
  }

  const data = generateGoodsCollection(usedPriceLists, city);
  await addManyAnalysisData({ analysisData: data });
}

getPerformance(addAnalysisData)
  .then(() => {
    console.log("/************** DIFF ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding analysis data:", err);
    process.exit(1);
  });
