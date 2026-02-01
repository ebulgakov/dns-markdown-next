import type { User } from "#types/user.ts";
import { ObjectId } from "mongodb";
import type { AnalysisData } from "#types/analysis-data.ts";

export type FavoriteUpdate = "availability" | "price";

export default function updateFavorites(users: User[], history: AnalysisData[]) {
  return users.map(user => {
    user.favorites = user.favorites.map(favorite => {
      const historyItem = history.find(historyItem => historyItem.link === favorite.item.link);

      favorite.status.updates = [] as FavoriteUpdate[];

      if ((!historyItem && !favorite.status.deleted) || (historyItem && favorite.status.deleted)) {
        favorite.status.deleted = !historyItem;
        favorite.status.updatedAt = `${new ObjectId().getTimestamp()}`;
        favorite.status.updates.push("availability");
      }

      if (historyItem) {
        const priceOld = historyItem.priceOld || "0";
        const price = historyItem.price || "0";
        const profit = historyItem.profit || "0";

        if (price !== favorite.item.price) {
          favorite.status.updatedAt = `${new ObjectId().getTimestamp()}`;
          favorite.status.updates.push("price");
        }

        favorite.item.price = price;
        favorite.item.priceOld = priceOld;
        favorite.item.profit = profit;
      }

      return favorite;
    });

    return user;
  });
}
