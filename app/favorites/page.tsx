import ErrorMessage from "@/app/components/ErrorMessage";
import { getUserFavorites } from "@/db/profile/queries";

export default async function FavoritesPage() {
  let favorites;
  let error: Error | null = null;

  try {
    favorites = await getUserFavorites();
  } catch (e) {
    error = e as Error;
  }

  if (!favorites && error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Избранное</h1>
      <div className="text-lg">{JSON.stringify(favorites, null, 2)}</div>
    </div>
  );
}
