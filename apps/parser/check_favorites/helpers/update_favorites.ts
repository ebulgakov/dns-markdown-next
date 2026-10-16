import { ObjectId } from "mongodb";

import type { FavoriteStatus } from "#email/updates-email.ts";
import type { AnalysisData } from "@dns-markdown/db/types/analysis-data";
import type { User } from "@dns-markdown/db/types/user";

export default function updateFavorites(users: User[], history: AnalysisData[]) {
  const statuses: FavoriteStatus[] = [];
  const updatedUsers = users.map(user => {
    user.favorites = user.favorites.map(favorite => {
      const historyItem = history.find(historyItem => historyItem.link === favorite.item.link);
      const favoriteStatus: FavoriteStatus = {
        id: favorite._id,
        status: []
      };

      if ((!historyItem && !favorite.status.deleted) || (historyItem && favorite.status.deleted)) {
        favorite.status.deleted = !historyItem;
        favorite.status.updatedAt = `${new ObjectId().getTimestamp()}`;
        favoriteStatus.status.push("availability");
      }

      if (historyItem) {
        const priceOld = historyItem.priceOld || "0";
        const price = historyItem.price || "0";
        const profit = historyItem.profit || "0";

        if (price !== favorite.item.price) {
          favorite.status.updatedAt = `${new ObjectId().getTimestamp()}`;
          favoriteStatus.status.push("price");
        }

        favorite.item.price = price;
        favorite.item.priceOld = priceOld;
        favorite.item.profit = profit;
      }

      statuses.push(favoriteStatus);

      return favorite;
    });

    return user;
  });

  return {
    users: updatedUsers,
    statuses
  };
}
