import PriceList from "@/app/components/PriceList/PriceList";
import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";
import Title from "@/app/components/Title";

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
  return favoriteSections.length > 0 ? (
    <>
      <Title variant="h2">Избранные категории</Title>
      <PriceList
        positions={favoriteSections}
        favorites={userFavoritesGoods}
        hiddenSections={hiddenSectionsTitles}
      />
      <Title variant="h2">Все категории</Title>
    </>
  ) : (
    <div className="border border-green-800 bg-green-50 text-green-800 rounded-lg p-4 mb-10">
      Добавьте избранные категории в вашем профиле и они всегда будут закреплены вверху списка
    </div>
  );
}
