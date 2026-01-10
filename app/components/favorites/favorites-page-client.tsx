"use client";

import { Star } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";

import { PriceListGoods } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { CheckboxWithLabel } from "@/app/components/ui/control-with-label";
import { PageTitle } from "@/app/components/ui/page-title";
import { toggleBoughtVisibilityFavorites } from "@/db/user/mutations/toggle-bought-visibility-favorites";

import type { Favorite } from "@/types/user";

type FavoritesPageClientProps = {
  favorites: Favorite[];
  shownBoughtFavorites: boolean;
};

function FavoritesPageClient({
  favorites,
  shownBoughtFavorites: defaultVisibility
}: FavoritesPageClientProps) {
  const [errorMessage, setErrorMessage] = useState<Error | null>(null);
  const [realShownBoughtFavorites, setRealShownBoughtFavorites] =
    useState<boolean>(defaultVisibility);
  const [shownBoughtFavorites, setShownBoughtFavorites] = useOptimistic<boolean, boolean>(
    realShownBoughtFavorites,
    (_, newSections) => newSections
  );
  const filteredFavorites = favorites.filter(favorite =>
    shownBoughtFavorites ? true : !favorite.status.deleted
  );

  const handleFavoritesVisibility = (status: boolean) => {
    startTransition(async () => {
      setShownBoughtFavorites(status);

      try {
        const val = await toggleBoughtVisibilityFavorites(status);
        setRealShownBoughtFavorites(val);
      } catch (error) {
        setErrorMessage(error as Error);
      }
    });
  };
  return (
    <div>
      <PageTitle title="Избранное">
        <CheckboxWithLabel
          label="Показать купленные товары"
          checked={shownBoughtFavorites}
          onCheckedChange={handleFavoritesVisibility}
        />
      </PageTitle>

      {errorMessage && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTitle>Ошибка при обновлении видимости купленных избранных</AlertTitle>
            <AlertDescription>{errorMessage.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {filteredFavorites.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {filteredFavorites.map(favorite => (
            <PriceListGoods
              key={favorite.item._id}
              item={favorite.item}
              status={favorite.status}
              favorites={favorites}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTitle>Избранное пусто</AlertTitle>
          <AlertDescription>
            <div>
              Добавьте товары в избранное (<Star className="text-favorite inline-block" />
              ), чтобы они отобразились здесь.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export { FavoritesPageClient };
