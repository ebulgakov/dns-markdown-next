import { get as cacheGet, add as cacheAdd } from "@/cache";
import { getAnalysisGoodsByParam } from "@/db/analysis-data/queries";
import { dbConnect } from "@/db/database";
import { getLastPriceList } from "@/db/pricelist/queries/get-last-price-list";

import type { AnalysisData } from "@/types/analysis-data";
import type { DiffHistory } from "@/types/analysis-diff";
import type { FavoriteStatus } from "@/types/user";

type PayloadType = {
  item: AnalysisData;
  history: DiffHistory;
  status: FavoriteStatus;
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

  const lastPriceList = await getLastPriceList(city);
  const flatCatalog = lastPriceList.positions.flatMap(position => position.items.flat());
  const ifExists = flatCatalog.find(item => item.link === link);
  const status = {
    city,
    updates: [],
    createdAt: history[history.length - 1].dateAdded,
    updatedAt: history[history.length - 1].dateAdded,
    deleted: !ifExists
  };

  const payload = JSON.stringify({ item, history, status });
  await cacheAdd(key, payload);

  return JSON.parse(payload) as PayloadType;
};
