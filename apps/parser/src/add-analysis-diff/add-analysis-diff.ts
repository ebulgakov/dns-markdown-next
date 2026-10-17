import { api } from "@src/api/client";
import { env } from "@src/env";

import makeDiff from "./helpers/make-diff";

import type { AnalysisData } from "@dns-markdown/types/analysis-data";

export async function addAnalysisDiff() {
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

  const priceListsCollections = await api.service.getAllPriceLists(options);

  if (writeStrategy === "replace") {
    await api.service.deleteAnalysisDiffAll(city);
  } else {
    // Avoid duplication if I run this task many times
    if (priceListsCollections[0]) {
      await api.service.deleteAnalysisDiffByDate({
        date: priceListsCollections[0].createdAt,
        city
      });
    }
  }

  const diffs = [];
  for (let i = 1; i < priceListsCollections.length; i++) {
    const previousDateGoods = priceListsCollections[i];
    const currentDateGoods = priceListsCollections[i - 1];

    if (previousDateGoods && currentDateGoods) {
      const prev = await api.analysis.getGoodsByDateAdded({
        date: previousDateGoods.createdAt,
        city
      });
      const current = await api.analysis.getGoodsByDateAdded({
        date: currentDateGoods.createdAt,
        city
      });

      diffs.push(makeDiff(current, prev, { city, dateAdded: currentDateGoods.createdAt }));
    }
  }

  // Add diff for the very first price list against an empty previous state
  if (writeStrategy === "replace") {
    const currentDateGoods = priceListsCollections[priceListsCollections.length - 1];
    if (currentDateGoods) {
      const current = await api.analysis.getGoodsByDateAdded({
        date: currentDateGoods.createdAt,
        city
      });
      const prev: AnalysisData[] = [];
      diffs.push(makeDiff(current, prev, { city, dateAdded: currentDateGoods.createdAt }));
    }
  }

  await api.service.addManyAnalysisDiff(diffs);
}
