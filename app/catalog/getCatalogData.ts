import { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";
import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import { getUserFavorites, getUserSections } from "@/db/profile/queries";
import { getLastPriceList } from "@/db/pricelist/queries";

export async function getCatalogData() {
  let priceList;
  let userFavoritesGoods;
  let favoriteSections;
  let hiddenSections;
  let nonFavoriteSections;
  let error;

  try {
    //
    priceList = await getLastPriceList();
    if (!priceList) throw new Error("No any price lists in the catalog");
    priceList = JSON.parse(JSON.stringify(priceList)) as PriceListType;

    //
    userFavoritesGoods = await getUserFavorites();
    userFavoritesGoods = JSON.parse(JSON.stringify(userFavoritesGoods));

    //
    const userSectionsResult = await getUserSections();
    const userSections = JSON.parse(JSON.stringify(userSectionsResult));
    hiddenSections = userSections.hidden;

    favoriteSections = [];
    nonFavoriteSections = [];

    if (userSections.favorites && userSections.favorites.length > 0) {
      priceList.positions.forEach(position => {
        if (userSections.favorites.includes(position.title)) {
          favoriteSections.push(position);
        } else {
          nonFavoriteSections.push(position);
        }
      });
    } else {
      nonFavoriteSections = priceList.positions;
    }
  } catch (e) {
    error = e as Error;
  }

  return {
    priceList,
    userFavoritesGoods,
    favoriteSections,
    hiddenSections,
    nonFavoriteSections,
    error
  } as {
    priceList: PriceListType;
    userFavoritesGoods: FavoriteType[];
    hiddenSections: UserSectionsType | undefined;
    favoriteSections: PositionType[] | undefined;
    nonFavoriteSections: PositionType[] | undefined;
    error: Error | undefined;
  };
}
