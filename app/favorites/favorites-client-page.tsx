"use client";

import { startTransition, useOptimistic, useState } from "react";

import { ProductCard } from "@/entities/product";
import { postToggleFavoriteShownBought } from "@/entities/user";
import { Favorite } from "@/entities/user";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { CheckboxWithLabel } from "@/shared/ui/control-with-label";
import { PageTitle } from "@/shared/ui/page-title";

type FavoritesPageClientProps = {
  favorites: Favorite[];
  shownBoughtFavorites: boolean;
};

function FavoritesClientPage({
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
  const filteredFavorites = favorites
    .filter(favorite => (shownBoughtFavorites ? true : !favorite.status.deleted))
    .sort((a, b) => {
      const deletedA = a.status.deleted ? 1 : 0;
      const deletedB = b.status.deleted ? 1 : 0;
      return deletedB - deletedA; // first show deleted, then non-deleted, because if non-deleted list is very long,  user may not  see them first
    });

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

  return (
    <div data-testid="favorites-page">
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
          <ProductCard
            key={favorite.item._id}
            item={favorite.item}
            status={favorite.status}
            shownFavorites={!favorite.status.deleted}
          />
        ))}
      </div>
    </div>
  );
}

export { FavoritesClientPage };
