import getPerformance from "#helpers/get_performance.ts";
import { dbConnect, dbDisconnect } from "#db/database.ts";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.ts";
import type { PriceList } from "#types/pricelist.ts";
import makeDiff from "#add_analysis_diff/helpers/make_diff.ts";
import { getAnalysisGoodsByParam } from "#db/analysis_data/queries/get-analysis-goods-by-param.ts";
import { addManyAnalysisDiff } from "#db/analysis_diff/mutations/add_many_analysis_diff.ts";
import { removeAllAnalysisDiff } from "#db/analysis_diff/mutations/remove_all_analysis_diff.ts";
import { removeAnalysisByDateDiff } from "#db/analysis_diff/mutations/remove_analysis_by_date_diff.ts";
import type { AnalysisData } from "#types/analysis_data.ts";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  await dbConnect();

  const priceListsCollections = await getAllPriceLists(city);

  let usedPriceLists: PriceList[] = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    await removeAllAnalysisDiff(city);
  } else {
    usedPriceLists = [priceListsCollections[0], priceListsCollections[1]];
    await removeAnalysisByDateDiff(priceListsCollections[1].createdAt, city);
  }

  const diffs = [];
  for (let i = 1; i < usedPriceLists.length; i++) {
    const previousDateGoods = usedPriceLists[i];
    const currentDateGoods = usedPriceLists[i - 1];

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

  // Add diff for the very first price list against an empty previous state
  if (writeStrategy === "replace") {
    const currentDateGoods = priceListsCollections[priceListsCollections.length - 1];
    const current = await getAnalysisGoodsByParam({
      param: "dateAdded",
      value: currentDateGoods.createdAt,
      city
    });
    const prev: AnalysisData[] = [];
    diffs.push(makeDiff(current, prev, { city, dateAdded: currentDateGoods.createdAt }));
  }

  await addManyAnalysisDiff(diffs);

  await dbDisconnect();
}

getPerformance(addAnalysisDiff).then(() => {
  console.log("/************** ANALYSIS DIFF ADDED ****************/");
});
