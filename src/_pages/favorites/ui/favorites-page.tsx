import { getFavoritesData } from "../api/get-favorites-data";

import { FavoritesClientPage } from "./favorites-client-page";
import { FavoritesEmptyAlert } from "./favorites-empty-alert";

async function FavoritesPage() {
  const { favorites, shownBoughtFavorites } = await getFavoritesData();

  if (favorites.length === 0) {
    return <FavoritesEmptyAlert />;
  }

  return <FavoritesClientPage favorites={favorites} shownBoughtFavorites={shownBoughtFavorites} />;
}

export { FavoritesPage };
