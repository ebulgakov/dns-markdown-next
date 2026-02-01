import getPerformance from "#helpers/get_performance.ts";
import type { PriceList } from "#types/pricelist.ts";
import makeDiff from "#add_analysis_diff/helpers/make_diff.ts";
import { getAllPriceLists, getAnalysisGoodsByDateAdded } from "#api/get.ts";
import { deleteAnalysisDiffAll, deleteAnalysisDiffByDate, addManyAnalysisDiff } from "#api/post.ts";
import type { AnalysisData } from "#types/analysis-data.ts";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  const priceListsCollections = await getAllPriceLists(city);

  let usedPriceLists: PriceList[] = [];

  if (writeStrategy === "replace") {
    usedPriceLists = priceListsCollections;
    await deleteAnalysisDiffAll(city);
  } else {
    usedPriceLists = priceListsCollections.slice(0, 2);
    if (usedPriceLists[0]) {
      await deleteAnalysisDiffByDate({ date: usedPriceLists[0].createdAt, city });
    }
  }

  const diffs = [];
  for (let i = 1; i < usedPriceLists.length; i++) {
    const previousDateGoods = usedPriceLists[i];
    const currentDateGoods = usedPriceLists[i - 1];

    if (previousDateGoods && currentDateGoods) {
      const prev = await getAnalysisGoodsByDateAdded({ date: previousDateGoods.createdAt, city });
      const current = await getAnalysisGoodsByDateAdded({ date: currentDateGoods.createdAt, city });

      diffs.push(makeDiff(current, prev, { city, dateAdded: currentDateGoods.createdAt }));
    }
  }

  // Add diff for the very first price list against an empty previous state
  if (writeStrategy === "replace") {
    const currentDateGoods = priceListsCollections[priceListsCollections.length - 1];
    if (currentDateGoods) {
      const current = await getAnalysisGoodsByDateAdded({ date: currentDateGoods.createdAt, city });
      const prev: AnalysisData[] = [];
      diffs.push(makeDiff(current, prev, { city, dateAdded: currentDateGoods.createdAt }));
    }
  }

  await addManyAnalysisDiff(diffs);
}

getPerformance(addAnalysisDiff).then(() => {
  console.log("/************** ANALYSIS DIFF ADDED ****************/");
});
