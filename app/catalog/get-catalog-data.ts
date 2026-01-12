import { getLastPriceList, getPriceListCity } from "@/db/pricelist/queries";
import { getUser } from "@/db/user/queries";

import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

export async function getCatalogData() {
  const favoriteSections: PositionType[] = [];
  const nonFavoriteSections: PositionType[] = [];
  let priceList: PriceListType | null = null;
  let userFavoritesGoods: FavoriteType[] = [];
  let hiddenSectionsTitles: UserSectionsType = [];
  let error;

  try {
    const city = await getPriceListCity();
    priceList = await getLastPriceList(city);
    if (!priceList) throw new Error("Price list not found");
  } catch (e) {
    error = e as Error;
  }

  try {
    const user = await getUser();

    userFavoritesGoods = user.favorites;
    hiddenSectionsTitles = user.hiddenSections;

    if (user.favoriteSections.length > 0) {
      priceList?.positions.forEach(position => {
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
    nonFavoriteSections,
    error
  };
}
