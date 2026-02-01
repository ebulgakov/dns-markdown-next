import getPerformance from "#helpers/get_performance.ts";
import generateGoodsCollection from "#add_analysis_data/helpers/generate_goods_collection.ts";
import { getAllPriceLists } from "#api/get.ts";
import { deleteAllAnalysisData, deleteAnalysisByDateData, addManyAnalysisData } from "#api/post.ts";

async function addAnalysisData() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  const priceListsCollections = await getAllPriceLists(city);

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

getPerformance(addAnalysisData).then(() => {
  console.log("/************** DIFF ADDED ****************/");
});
