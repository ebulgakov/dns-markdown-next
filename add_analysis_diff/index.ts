import getPerformance from "#helpers/get_performance.ts";
import type { PriceList } from "#types/pricelist.ts";
import makeDiff from "#add_analysis_diff/helpers/make_diff.ts";
import { getAllPriceLists } from "#api/get.js";
import { deleteAnalysisDiffAll, deleteAnalysisDiffByDate } from "#api/post.js";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  const priceListsCollections = await getAllPriceLists(city);

  let usedPriceLists: PriceList[] = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    await deleteAnalysisDiffAll(city);
  } else {
    usedPriceLists = [priceListsCollections[0], priceListsCollections[1]];
    await deleteAnalysisDiffByDate({ date: priceListsCollections[1].createdAt, city });
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
}

getPerformance(addAnalysisDiff).then(() => {
  console.log("/************** ANALYSIS DIFF ADDED ****************/");
});
