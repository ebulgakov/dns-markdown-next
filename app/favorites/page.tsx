import { getUser as getGenericUser } from "@/api/post";
import { FavoritesPageClient } from "@/app/components/favorites";

export default async function FavoritesPage() {
  const genericUser = await getGenericUser();

  return (
    <FavoritesPageClient
      favorites={genericUser?.favorites}
      shownBoughtFavorites={genericUser?.shownBoughtFavorites}
    />
  );
}
