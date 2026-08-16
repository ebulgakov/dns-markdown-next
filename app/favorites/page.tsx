import { FavoritesEmptyAlert } from "@/app/components/alerts/favorites-empty-alert";
import { getFlatPriceList } from "@/entities/product";
import { getLastPriceList } from "@/entities/product";
import { getUser } from "@/entities/user";
import { getSessionInfo } from "@/entities/user";

import { FavoritesClientPage } from "./favorites-client-page";

import type { Favorite } from "@/entities/user";

export default async function FavoritesPage() {
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
          fav.status.deleted = !found && (!fav.status.city || fav.status.city === lastPriceList.city); // mark as deleted if not found in the price list and city matches
          return fav;
        });
        shownBoughtFavorites = user.shownBoughtFavorites;
      }
    }
  } catch {
    // silently ignore errors, as favorites are not critical for the page to function
  }

  if (favorites.length === 0) {
    return <FavoritesEmptyAlert />;
  }

  return <FavoritesClientPage favorites={favorites} shownBoughtFavorites={shownBoughtFavorites} />;
}
