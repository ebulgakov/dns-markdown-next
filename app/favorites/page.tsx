import { getGuest } from "@/api/guest";
import { getUser } from "@/api/user";
import { FavoritesPageClient } from "@/app/components/favorites";

export default async function FavoritesPage() {
  const guest = await getGuest();
  const user = await getUser();
  const genericUser = user || guest;

  return (
    <FavoritesPageClient
      favorites={genericUser.favorites}
      shownBoughtFavorites={genericUser.shownBoughtFavorites}
    />
  );
}
