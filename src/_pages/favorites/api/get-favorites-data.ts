import { getFlatPriceList, getLastPriceList } from "@/entities/product";
import { getSessionInfo, getUser } from "@/entities/user";

import type { Favorite } from "@/entities/user";

export async function getFavoritesData() {
  const { userId } = await getSessionInfo();

  let favorites: Favorite[] = [];
  let shownBoughtFavorites: boolean = false;

  try {
    const user = await getUser();

    if (user) {
      if (userId) {
        favorites = user.favorites;
        shownBoughtFavorites = user.shownBoughtFavorites;
      } else {
        const lastPriceList = await getLastPriceList();
        if (!lastPriceList) throw new Error("Price list not found for guests's city");

        const flatCatalog = getFlatPriceList(lastPriceList);
        favorites = user.favorites.map(fav => {
          const found = flatCatalog.find(i => i.link === fav.item.link);
          fav.status.deleted =
            !found && (!fav.status.city || fav.status.city === lastPriceList.city); // mark as deleted if not found in the price list and city matches
          return fav;
        });
        shownBoughtFavorites = user.shownBoughtFavorites;
      }
    }
  } catch {
    // silently ignore errors, as favorites are not critical for the page to function
  }

  return { favorites, shownBoughtFavorites };
}
