import getPerformance from "#helpers/get_performance.ts";
import makeDiff from "#add_analysis_diff/helpers/make_diff.ts";
import { getAllPriceLists, getAnalysisGoodsByDateAdded } from "#api/get.ts";
import { deleteAnalysisDiffAll, deleteAnalysisDiffByDate, addManyAnalysisDiff } from "#api/post.ts";
import type { AnalysisData } from "#types/analysis-data.ts";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY;

  if (!city) throw new Error("No city found");

  const options: {
    city: string;
    limit?: number;
  } = {
    city,
    ...(writeStrategy === "insert" ? { limit: 2 } : {})
  };

  const priceListsCollections = await getAllPriceLists(options);

  if (writeStrategy === "replace") {
    await deleteAnalysisDiffAll(city);
  } else {
    // Avoid duplication if I run this task many times
    if (priceListsCollections[0]) {
      await deleteAnalysisDiffByDate({ date: priceListsCollections[0].createdAt, city });
    }
  }

  const diffs = [];
  for (let i = 1; i < priceListsCollections.length; i++) {
    const previousDateGoods = priceListsCollections[i];
    const currentDateGoods = priceListsCollections[i - 1];

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

getPerformance(addAnalysisDiff)
  .then(() => {
    console.log("/************** ANALYSIS DIFF ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding analysis diff:", err);
  });
