import { FavoritesPageClient } from "@/app/components/favorites";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { getUser } from "@/db/user/queries";

import type { Favorite, User } from "@/types/user";

export default async function FavoritesPage() {
  let favorites;
  let shownBoughtFavorites;

  try {
    let user = await getUser();
    if (!user) throw new Error("No user found!");
    user = JSON.parse(JSON.stringify(user)) as User;
    shownBoughtFavorites = user.shownBoughtFavorites;
    favorites = user.favorites.reverse() as Favorite[];
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки избранного</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return <FavoritesPageClient favorites={favorites} shownBoughtFavorites={shownBoughtFavorites} />;
}
