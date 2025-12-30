import PriceList from "@/app/components/PriceList/PriceList";
import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

type PriceListFavoritesSectionProps = {
  favoriteSections: PositionType[];
  userFavoritesGoods?: FavoriteType[];
  hiddenSectionsTitles?: UserSectionsType;
};

export default function PriceListFavoritesSection({
  favoriteSections,
  userFavoritesGoods,
  hiddenSectionsTitles
}: PriceListFavoritesSectionProps) {
  return (
    <>
      {favoriteSections.length > 0 ? (
        <>
          <h2 className="text-3xl mb-5">Избранные категории</h2>
          <PriceList
            positions={favoriteSections}
            favorites={userFavoritesGoods}
            hiddenSections={hiddenSectionsTitles}
          />
          <h2 className="text-3xl mb-5 mt-10">Все категории</h2>
        </>
      ) : (
        <div className="border border-green-800 bg-green-50 text-green-800 rounded-lg p-4 mb-10">
          Добавьте избранные категории в вашем профиле и они всегда будут закреплены вверху списка
        </div>
      )}
    </>
  );
}
