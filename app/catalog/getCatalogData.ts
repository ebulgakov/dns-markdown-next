import { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";
import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import { getUser } from "@/db/profile/queries";
import { getLastPriceList } from "@/db/pricelist/queries";

export async function getCatalogData() {
  const favoriteSections: PositionType[] = [];
  const nonFavoriteSections: PositionType[] = [];
  let priceList;
  let userFavoritesGoods;
  let hiddenSectionsTitles;
  let error;

  try {
    //
    priceList = await getLastPriceList();
    if (!priceList) throw new Error("No any price lists in the catalog");
    priceList = JSON.parse(JSON.stringify(priceList)) as PriceListType;

    //
    const user = await getUser();
    if (!user) throw new Error("No user found");

    //
    userFavoritesGoods = JSON.parse(JSON.stringify(user.favorites));
    hiddenSectionsTitles = JSON.parse(JSON.stringify(user.hiddenSections));

    //
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
