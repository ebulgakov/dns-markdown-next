import { getUser } from "@/api/user";
import { FavoritesPageClient } from "@/app/components/favorites";

export default async function FavoritesPage() {
  const user = await getUser();

  return (
    <FavoritesPageClient
      isUserLoggedIn={!!user}
      userFavorites={user?.favorites}
      shownBoughtFavorites={user?.shownBoughtFavorites}
    />
  );
}
