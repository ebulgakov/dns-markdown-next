import generateGoodsCollection from "#add_analysis_data/helpers/generate_goods_collection.ts";
import { getAllPriceLists } from "#api/get.ts";
import { deleteAllAnalysisData, deleteAnalysisByDateData, addManyAnalysisData } from "#api/post.ts";
import { env } from "#env.ts";
import getPerformance from "#helpers/get_performance.ts";

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
