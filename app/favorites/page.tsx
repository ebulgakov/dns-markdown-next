import { FavoritesPageClient } from "@/app/components/favorites";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { getUser } from "@/db/user/queries";

export default async function FavoritesPage() {
  let favorites;
  let shownBoughtFavorites;

  try {
    const user = await getUser();
    shownBoughtFavorites = user.shownBoughtFavorites;
    favorites = user.favorites.reverse();
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
