import ErrorMessage from "@/app/components/ErrorMessage";
import { getUserFavorites } from "@/db/profile/queries";

export default async function FavoritesPage() {
  let favorites;

  try {
    favorites = await getUserFavorites();
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Избранное</h1>
      <div className="text-lg">{JSON.stringify(favorites, null, 2)}</div>
    </div>
  );
}
