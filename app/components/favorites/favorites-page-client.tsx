"use client";

import { startTransition, useOptimistic, useState } from "react";

import { postToggleFavoriteShownBought } from "@/api/user";
import { PriceListGoods } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { CheckboxWithLabel } from "@/app/components/ui/control-with-label";
import { PageTitle } from "@/app/components/ui/page-title";
import { Favorite } from "@/types/user";

import { FavoritesEmpty } from "./favorites-empty";

type FavoritesPageClientProps = {
  favorites?: Favorite[];
  shownBoughtFavorites?: boolean;
};

function FavoritesPageClient({
  favorites = [],

  shownBoughtFavorites: defaultVisibility = false
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
        const data = await postToggleFavoriteShownBought(status);
        if (!data) throw new Error("No data returned from server");
        setRealShownBoughtFavorites(data.shownBoughtFavorites);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error as Error);
      }
    });
  };

  if (favorites.length === 0) {
    return <FavoritesEmpty />;
  }

  return (
    <div>
      <PageTitle title="Избранное">
        <div className="mt-2 md:mt-0">
          <CheckboxWithLabel
            label="Показать купленные товары"
            checked={shownBoughtFavorites}
            onCheckedChange={handleFavoritesVisibility}
          />
        </div>
      </PageTitle>

      {errorMessage && (
        <div className="mb-4">
          <Alert variant="destructive">
            <AlertTitle>Ошибка при обновлении видимости купленных избранных</AlertTitle>
            <AlertDescription>{errorMessage.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {filteredFavorites.map(favorite => (
          <PriceListGoods
            key={favorite.item._id}
            item={favorite.item}
            status={favorite.status}
            favorites={!favorite.status.deleted ? favorites : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export { FavoritesPageClient };
