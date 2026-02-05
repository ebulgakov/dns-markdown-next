import { getLastPriceList } from "@/api/get";
import { getGuest } from "@/api/guest";
import { getUser } from "@/api/user";
import { getSessionInfo } from "@/api/user";
import { FavoritesPageClient } from "@/app/components/favorites";
import { getFlatPriceList } from "@/app/helpers/pricelist";

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
      const lastPriceList = await getLastPriceList(guest.city);
      if (!lastPriceList) throw new Error("Price list not found for guests's city");

      const flatCatalog = getFlatPriceList(lastPriceList);
      favorites = guest.favorites.map(fav => {
        const found = flatCatalog.find(i => i.link === fav.item.link);
        fav.status.deleted = !found;
        return fav;
      });
      shownBoughtFavorites = guest.shownBoughtFavorites;
    } catch {
      // silently ignore errors, as favorites are not critical for the page to function
    }
  }

  return <FavoritesPageClient favorites={favorites} shownBoughtFavorites={shownBoughtFavorites} />;
}
