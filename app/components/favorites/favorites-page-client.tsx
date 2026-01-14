"use client";

import { startTransition, useEffect, useOptimistic, useState } from "react";

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
  const [isClient, setIsClient] = useState(false);
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
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error as Error);
      }
    });
  };

  useEffect(() => {
    // https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
    setIsClient(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  return isClient ? (
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
            isUserLoggedIn={true}
          />
        ))}
      </div>
    </div>
  ) : null;
}

export { FavoritesPageClient };
