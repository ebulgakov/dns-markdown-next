import ErrorMessage from "@/app/components/ErrorMessage";
import { getUser } from "@/db/profile/queries";
import PriceListGoods from "@/app/components/PriceList/PriceListGoods";
import type { Favorite } from "@/types/user";
import PageTitle from "@/app/components/PageTitle";

export default async function FavoritesPage() {
  let favorites;

  try {
    const user = await getUser();
    if (!user) throw new Error("No user found!");
    favorites = JSON.parse(JSON.stringify(user.favorites.reverse())) as Favorite[];
  } catch (e) {
    const { message } = e as Error;
    return <ErrorMessage>{message}</ErrorMessage>;
  }

  return (
    <div>
      <PageTitle title="Избранное" />
      <div className="divide-y divide-gray-200">
        {favorites.map(favorite => (
          <PriceListGoods key={favorite.item._id} item={favorite.item} status={favorite.status} favorites={favorites} />
        ))}
      </div>
    </div>
  );
}
