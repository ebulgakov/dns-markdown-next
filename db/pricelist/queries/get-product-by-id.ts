import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { History } from "@/db/models/history-model";
import { Pricelist } from "@/db/models/pricelist-model";

import type { History as HistoryType } from "@/types/history";
import type { Goods, PriceList as PriceListType } from "@/types/pricelist";

type PayloadType = {
  item: Goods;
  history: HistoryType;
};

export const getProductById = async (id: string) => {
  if (!id) throw new Error("id is required");

  const key = `pricelist:goods:${String(id)}`;
  const cached = await cacheGet<PayloadType>(key);
  if (cached) return cached;

  await dbConnect();

  const history = (await History.findOne(
    { link: id },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as HistoryType | null;
  if (!history) throw new Error("History not found"); // Return

  const priceList = (await Pricelist.findOne(
    { city: history.city },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as PriceListType | null;
  if (!priceList) throw new Error("Price list not found"); // Return

  const positions = priceList.positions.flatMap(positionGroup => positionGroup.items);
  const item = positions.find((position: { link: string }) => position.link === id);

  if (!item) throw new Error("Product Item not found"); // Return

  item.city = history.city; // Added city specially for adding to favorites

  const payload = JSON.stringify({ item, history });
  await cacheAdd(key, payload);

  return JSON.parse(payload) as PayloadType;
};
