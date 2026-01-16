import { get as cacheGet, add as cacheAdd } from "@/cache";
import { getAnalysisGoodsByParam } from "@/db/analysis-data/queries";
import { dbConnect } from "@/db/database";

import type { AnalysisData } from "@/types/analysis-data";
import type { DiffHistory } from "@/types/analysis-diff";

type PayloadType = {
  item: AnalysisData;
  history: DiffHistory;
};

export const getProductById = async (link: string, city: string) => {
  if (!link) throw new Error("link is required");

  const key = `pricelist:goods:${String(link)}:${city}`;
  const cached = await cacheGet<PayloadType>(key);
  if (cached) return cached;

  await dbConnect();

  const historyList = await getAnalysisGoodsByParam({ param: "link", value: link, city });
  if (!historyList || historyList.length === 0) throw new Error("Product not found");

  const item = historyList[historyList.length - 1];
  const history: DiffHistory = historyList.map(entry => {
    return {
      dateAdded: entry.dateAdded,
      price: entry.price,
      priceOld: entry.priceOld,
      profit: entry.profit
    };
  });

  const payload = JSON.stringify({ item, history });
  await cacheAdd(key, payload);

  return JSON.parse(payload) as PayloadType;
};
