import { FavoritesPageClient } from "@/app/components/favorites";
import { getFlatPriceList } from "@/app/helpers/pricelist";
import { getLastPriceList } from "@/services/get";
import { getGuest } from "@/services/guest";
import { getUser } from "@/services/user";
import { getSessionInfo } from "@/services/user";

import type { Favorite } from "@/types/user";

export default async function FavoritesPage() {
  const { userId } = await getSessionInfo();

  let favorites: Favorite[] = [];
  let shownBoughtFavorites: boolean = false;

  if (userId) {
    try {
      const user = await getUser();
      if (user) {
        favorites = user.favorites;
        shownBoughtFavorites = user.shownBoughtFavorites;
      }
    } catch {
      // silently ignore errors, as favorites are not critical for the page to function
    }
  } else {
    try {
      const guest = await getGuest();
      const lastPriceList = await getLastPriceList();
      if (!lastPriceList) throw new Error("Price list not found for guests's city");

      const flatCatalog = getFlatPriceList(lastPriceList);
      favorites = guest.favorites.map(fav => {
        const found = flatCatalog.find(i => i.link === fav.item.link);
        fav.status.deleted = !found && (!fav.status.city || fav.status.city === lastPriceList.city); // mark as deleted if not found in the price list and city matches
        return fav;
      });
      shownBoughtFavorites = guest.shownBoughtFavorites;
    } catch {
      // silently ignore errors, as favorites are not critical for the page to function
    }
  }

  return <FavoritesPageClient favorites={favorites} shownBoughtFavorites={shownBoughtFavorites} />;
}
