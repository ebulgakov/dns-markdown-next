import { getLastPriceList } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PriceList from "@/app/components/PriceList/PriceList";
import type { PriceList as PriceListType } from "@/types/pricelist";
import { getUserFavorites } from "@/db/profile/queries";
import type { Favorite } from "@/types/user";

export default async function CatalogPage() {
  let priceList;
  let userFavorites;
  let error: Error | null = null;

  try {
    priceList = await getLastPriceList();

    if (!priceList) throw new Error("No any price lists in the catalog");
    // Convert Mongo Response into Object
    priceList = JSON.parse(JSON.stringify(priceList)) as PriceListType;

    userFavorites = await getUserFavorites();
    if (!userFavorites) throw new Error("Not possible to get user favorites");

    // Convert Mongo Response into Object
    userFavorites = JSON.parse(JSON.stringify(userFavorites)) as Favorite[];
  } catch (e) {
    error = e as Error;
  }

  if (!priceList) {
    return <ErrorMessage>{error?.message}</ErrorMessage>;
  }

  const date = new Date(priceList.createdAt);
  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <div>
      <div>
        <h1>
          {date.toLocaleDateString()} <small>{date.toLocaleTimeString()}</small>
        </h1>
        <div>
          Количество: <b>{count}</b>
        </div>
      </div>

      <PriceList priceList={priceList} favorites={userFavorites} />
    </div>
  );
}
