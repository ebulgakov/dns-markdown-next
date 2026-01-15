import { dbConnect, dbDisconnect } from "#db/database.js";
import getPerformance from "#helpers/get_performance.js";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.js";
import type { PriceList } from "#types/pricelist.js";
import generateGoodsCollection from "#add_analysis_data/helpers/generate_goods_collection.js";
import { removeAllAnalysisData } from "#db/analysis_data/mutation/remove_all_analysis_data.js";
import { addManyAnalysisData } from "#db/analysis_data/mutation/add_many_analysis_data.js";

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
  }

  const data = generateGoodsCollection(usedPriceLists, city);
  await addManyAnalysisData(data);

  await dbDisconnect();
}

getPerformance(addAnalysisData).then(() => {
  console.log("/************** DIFF ADDED ****************/");
});
