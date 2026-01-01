import { dbConnect } from "@/db/database";
import { History } from "@/db/models/history_model";
import type { History as HistoryType } from "@/types/history";
import { HourlyPricelist } from "@/db/models/pricelist_model";
import type { PriceList as PriceListType } from "@/types/pricelist";

export const getProductById = async (id: string) => {
  await dbConnect();

  const history = (await History.findOne(
    { link: id },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as HistoryType | null;
  if (!history) throw new Error("History not found");

  const priceList = (await HourlyPricelist.findOne(
    { city: history.city },
    {},
    { sort: { updatedAt: -1 } }
  )) as unknown as PriceListType | null;

  if (!priceList) throw new Error("Price list not found");

  const positions = priceList.positions.flatMap(positionGroup => positionGroup.items);
  const item = positions.find((position: { link: string }) => position.link === id);

  if (!item) throw new Error("Product Item not found");

  item.city = history.city; // Added city specially for adding to favorites

  return { item, history };
};
