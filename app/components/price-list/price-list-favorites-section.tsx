import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Title } from "@/app/components/ui/title";

import { PriceList } from "./price-list";

import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

type PriceListFavoritesSectionProps = {
  favoriteSections: PositionType[];
  userFavoritesGoods?: FavoriteType[];
  hiddenSectionsTitles?: UserSectionsType;
  isUserLoggedIn?: boolean;
};

function PriceListFavoritesSection({
  favoriteSections,
  userFavoritesGoods,
  hiddenSectionsTitles,
  isUserLoggedIn
}: PriceListFavoritesSectionProps) {
  return favoriteSections.length > 0 ? (
    <>
      <Title variant="h2">Избранные категории</Title>
      <PriceList
        positions={favoriteSections}
        favorites={userFavoritesGoods}
        hiddenSections={hiddenSectionsTitles}
        isUserLoggedIn={isUserLoggedIn}
      />
      <Title variant="h2">Все категории</Title>
    </>
  ) : (
    <div className="mb-10">
      <Alert variant="success">
        <AlertTitle>У вас нет избранных категорий</AlertTitle>
        <AlertDescription>
          Добавьте избранные категории в вашем профиле и они всегда будут закреплены вверху списка
        </AlertDescription>
      </Alert>
    </div>
  );
}
export { PriceListFavoritesSection };
