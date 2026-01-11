import { getLastPriceList } from "@/db/pricelist/queries";
import { getUser } from "@/db/user/queries";

import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

export async function getCatalogData() {
  const favoriteSections: PositionType[] = [];
  const nonFavoriteSections: PositionType[] = [];
  let priceList;
  let userFavoritesGoods;
  let hiddenSectionsTitles;
  let error;

  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");

    userFavoritesGoods = user.favorites;
    hiddenSectionsTitles = user.hiddenSections;

    priceList = await getLastPriceList(user.city);
    if (!priceList) throw new Error("Price list not found");

    if (user.favoriteSections.length > 0) {
      priceList.positions.forEach(position => {
        if (user.favoriteSections.includes(position.title)) {
          favoriteSections.push(position);
        } else {
          nonFavoriteSections.push(position);
        }
      });
    }
  } catch (e) {
    error = e as Error;
  }

  return {
    priceList,
    userFavoritesGoods,
    favoriteSections,
    hiddenSectionsTitles,
    nonFavoriteSections,
    error
  } as {
    priceList: PriceListType;
    userFavoritesGoods: FavoriteType[];
    hiddenSectionsTitles: UserSectionsType;
    favoriteSections: PositionType[];
    nonFavoriteSections: PositionType[];
    error: Error | undefined;
  };
}
