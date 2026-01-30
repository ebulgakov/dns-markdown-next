import { getLastPriceList, getUser, getPriceListCity } from "@/api";

import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

export async function getCatalogData() {
  const city = await getPriceListCity();
  const favoriteSections: PositionType[] = [];
  const nonFavoriteSections: PositionType[] = [];
  let priceList: PriceListType | undefined;
  let userFavoritesGoods: FavoriteType[] | undefined;
  let hiddenSectionsTitles: UserSectionsType | undefined;

  try {
    priceList = await getLastPriceList(city);
    if (!priceList) throw new Error();
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw new Error("Price list not found", { cause: e });
  }

  try {
    const user = await getUser();

    userFavoritesGoods = user.favorites;
    hiddenSectionsTitles = user.hiddenSections;

    if (user.favoriteSections.length > 0) {
      priceList.positions.forEach(position => {
        if (user.favoriteSections.includes(position.title)) {
          favoriteSections.push(position);
        } else {
          nonFavoriteSections.push(position);
        }
      });
    }
  } catch {
    userFavoritesGoods = [];
    hiddenSectionsTitles = [];
  }

  return {
    priceList,
    userFavoritesGoods,
    favoriteSections,
    hiddenSectionsTitles,
    nonFavoriteSections
  };
}
