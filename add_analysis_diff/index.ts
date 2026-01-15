import getPerformance from "#helpers/get_performance.js";
import { dbConnect, dbDisconnect } from "#db/database.js";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.js";
import type { PriceList } from "#types/pricelist.js";
import makeDiff from "#add_analysis_diff/helpers/make_diff.js";
import { getAnalysisGoodsByParam } from "#db/analysis_data/queries/get-analysis-goods-by-param.js";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  await dbConnect();

  const priceListsCollections = await getAllPriceLists(city);

  let usedPriceLists: PriceList[] = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
  } else {
    usedPriceLists = [priceListsCollections[0], priceListsCollections[1]];
  }

  const diffs = [];
  for (let i = 1; i < usedPriceLists.length; i++) {
    const currentDateGoods = usedPriceLists[i];
    const previousDateGoods = usedPriceLists[i - 1];

    const prev = await getAnalysisGoodsByParam({
      param: "dateAdded",
      value: previousDateGoods.createdAt,
      city
    });
    const current = await getAnalysisGoodsByParam({
      param: "dateAdded",
      value: currentDateGoods.createdAt,
      city
    });

    diffs.push(makeDiff(current, prev, { city, dateAdded: currentDateGoods.createdAt }));
  }

  console.log(diffs);

  await dbDisconnect();
}

getPerformance(addAnalysisDiff).then(() => {
  console.log("/************** ANALYSIS DIFF ADDED ****************/");
});
