import getPerformance from "#helpers/get_performance.js";
import { dbConnect, dbDisconnect } from "#db/database.js";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.js";
import type { PriceList } from "#types/pricelist.js";
import makeDiff from "#add_analysis_diff/helpers/make_diff.js";
import { getAnalysisGoodsByParam } from "#db/analysis_data/queries/get-analysis-goods-by-param.js";
import { addManyAnalysisDiff } from "#db/analysis_diff/mutations/add_many_analysis_diff.js";
import { removeAllAnalysisDiff } from "#db/analysis_diff/mutations/remove_all_analysis_diff.js";
import { removeAnalysisByDateDiff } from "#db/analysis_diff/mutations/remove_analysis_by_date_diff.js";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  await dbConnect();

  const priceListsCollections = await getAllPriceLists(city);

  let usedPriceLists: PriceList[] = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    removeAllAnalysisDiff(city);
  } else {
    usedPriceLists = [priceListsCollections[0], priceListsCollections[1]];
    removeAnalysisByDateDiff(priceListsCollections[1].createdAt, city);
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

  await addManyAnalysisDiff(diffs);

  await dbDisconnect();
}

getPerformance(addAnalysisDiff).then(() => {
  console.log("/************** ANALYSIS DIFF ADDED ****************/");
});
