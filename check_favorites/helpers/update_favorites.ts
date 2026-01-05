import { type User } from "../../types/user.ts";
import { type History } from "../../types/history.ts";
import { ObjectId } from "mongodb";

export default function updateFavorites(users: User[], history: History[]) {
  return users.map(user => {
    user.favorites = user.favorites.map(favorite => {
      const historyItem = history.find(historyItem => historyItem.link === favorite.item.link);

      if ((!historyItem && !favorite.status.deleted) || (historyItem && favorite.status.deleted)) {
        favorite.status.deleted = !historyItem;
        favorite.status.updatedAt = `${new ObjectId().getTimestamp()}`;
        favorite.status.updates.push("availability");
      }

      if (historyItem) {
        const priceOld = historyItem.priceOld.pop();
        const price = historyItem.price.pop();
        const profit = historyItem.profit.pop();

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
