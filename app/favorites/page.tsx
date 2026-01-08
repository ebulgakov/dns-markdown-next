import { getUser } from "@/db/user/queries";
import PriceListGoods from "@/app/components/PriceList/PriceListGoods";
import type { Favorite } from "@/types/user";
import { PageTitle } from "@/app/components/ui/page-title";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";

export default async function FavoritesPage() {
  let favorites;

  try {
    const user = await getUser();
    if (!user) throw new Error("No user found!");
    favorites = JSON.parse(JSON.stringify(user.favorites.reverse())) as Favorite[];
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки избранного</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <PageTitle title="Избранное" />
      <div className="divide-y divide-gray-200">
        {favorites.map(favorite => (
          <PriceListGoods
            key={favorite.item._id}
            item={favorite.item}
            status={favorite.status}
            favorites={favorites}
          />
        ))}
      </div>
    </div>
  );
}
