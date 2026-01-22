import { dbConnect, dbDisconnect } from "#db/database.ts";
import getPerformance from "#helpers/get_performance.ts";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.ts";
import type { PriceList } from "#types/pricelist.ts";
import generateGoodsCollection from "#add_analysis_data/helpers/generate_goods_collection.ts";
import { removeAllAnalysisData } from "#db/analysis_data/mutation/remove_all_analysis_data.ts";
import { removeAnalysisByDateData } from "#db/analysis_data/mutation/remove_analysis_by_date_data.ts";
import { addManyAnalysisData } from "#db/analysis_data/mutation/add_many_analysis_data.ts";

async function addAnalysisData() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  await dbConnect();

  const priceListsCollections = await getAllPriceLists(city);

  let usedPriceLists: PriceList[] = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    await removeAllAnalysisData(city);
  } else {
    usedPriceLists = [priceListsCollections[0]];
    await removeAnalysisByDateData(priceListsCollections[0].createdAt, city);
  }

  const data = generateGoodsCollection(usedPriceLists, city);
  await addManyAnalysisData(data);

  await dbDisconnect();
}

getPerformance(addAnalysisData).then(() => {
  console.log("/************** DIFF ADDED ****************/");
});
