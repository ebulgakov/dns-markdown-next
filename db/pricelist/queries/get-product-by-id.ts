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

export const getProductById = async (link: string, city: string, date: string) => {
  if (!city || !date || !link) throw new Error("link|city|date is required");

  const key = `pricelist:goods:${String(link)}:${city}-${date}`;
  const cached = await cacheGet<PayloadType>(key);
  if (cached) return cached;

  await dbConnect();

  const historyList = await getAnalysisGoodsByParam({ param: "link", value: link, city, date });
  if (!historyList || historyList.length === 0) throw new Error("Product not found");

  const product = historyList[historyList.length - 1];
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
    createdAt: history[0].dateAdded,
    updatedAt: history[history.length - 1].dateAdded,
    deleted: !ifExists
  };

  const payload = JSON.stringify({ item: product, history, status });
  await cacheAdd(key, payload, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(payload) as PayloadType;
};
