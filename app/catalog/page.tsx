import { getLastPriceList } from "@/db/pricelist/queries";
import ErrorMessage from "@/app/components/ErrorMessage";
import PriceList from "@/app/components/PriceList/PriceList";
import type { PriceList as PriceListType, Position as PositionType } from "@/types/pricelist";
import { getUserFavorites, getUserSections } from "@/db/profile/queries";
import { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

export default async function CatalogPage() {
  let priceList;
  let userFavoritesGoods;
  let userSections: {
    favorites: UserSectionsType | undefined;
    hidden?: UserSectionsType | undefined;
  };
  let favoriteSections: PositionType[] | null = null;
  let nonFavoriteSections: PositionType[] | null = null;
  let error: Error | null = null;

  try {
    [userFavoritesGoods, userSections, priceList] = await Promise.all([
      getUserFavorites(),
      getUserSections(),
      getLastPriceList()
    ]);

    if (!priceList) throw new Error("No any price lists in the catalog");

    // Convert Mongo Response into Object
    priceList = JSON.parse(JSON.stringify(priceList)) as PriceListType;
    userFavoritesGoods = JSON.parse(JSON.stringify(userFavoritesGoods)) as FavoriteType[];
    userSections = JSON.parse(JSON.stringify(userSections)) as {
      favorites: UserSectionsType | undefined;
      hidden?: UserSectionsType | undefined;
    };

    if (userSections.favorites && userSections.favorites.length > 0) {
      favoriteSections = [];
      nonFavoriteSections = [];

      priceList.positions.forEach(position => {
        if (userSections.favorites!.includes(position.title)) {
          favoriteSections!.push(position);
        } else {
          nonFavoriteSections!.push(position);
        }
      });
    }
  } catch (e) {
    error = e as Error;
  }

  if (error || !priceList) {
    return <ErrorMessage>{error?.message}</ErrorMessage>;
  }

  const date = new Date(priceList.createdAt);
  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <div>
      <div className="flex justify-between items-end border-b border-solid border-b-neutral-300  mt-10 mb-5 mx-0 pb-5">
        <h1 className="text-4xl">
          {date.toLocaleDateString()}{" "}
          <small className="font-normal leading-none text-[#777777] text-[65%]">
            {date.toLocaleTimeString()}
          </small>
        </h1>
        <div>
          Количество: <b>{count}</b>
        </div>
      </div>

      {favoriteSections ? (
        favoriteSections?.length > 0 && (
          <>
            <h2 className="text-3xl mb-5">Избранные категории</h2>
            <PriceList
              positions={favoriteSections}
              favorites={userFavoritesGoods}
              hiddenSections={userSections!.hidden}
            />
            <h2 className="text-3xl mb-5 mt-10">Все категории</h2>
          </>
        )
      ) : (
        <div className="border border-green-800 bg-green-50 text-green-800 rounded-lg p-4 mb-10">
          Добавьте избранные категории в вашем профиле и они всегда будут закреплены вверху списка
        </div>
      )}

      <PriceList
        positions={nonFavoriteSections || priceList.positions}
        favorites={userFavoritesGoods}
        hiddenSections={userSections!.hidden}
      />
    </div>
  );
}
