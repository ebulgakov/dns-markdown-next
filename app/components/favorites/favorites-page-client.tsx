"use client";

import { startTransition, useOptimistic, useState } from "react";

import { PriceListGoods } from "@/app/components/price-list";
import { PageTitle } from "@/app/components/ui/page-title";
import { toggleBoughtVisibilityFavorites } from "@/db/user/mutations/toggle-bought-visibility-favorites";

import { ToggleBoughtVisibilityFavorites } from "./toggle-bought-visibility-favorites";

import type { Favorite } from "@/types/user";

type FavoritesPageClientProps = {
  favorites: Favorite[];
  shownBoughtFavorites: boolean;
};

function FavoritesPageClient({
  favorites,
  shownBoughtFavorites: defaultVisibility
}: FavoritesPageClientProps) {
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
      setShownBoughtFavorites(!realShownBoughtFavorites);

      try {
        const val = await toggleBoughtVisibilityFavorites(status);
        setRealShownBoughtFavorites(val);
      } catch (error) {
        console.error("Ошибка при обновлении видимости купленных избранных:", error);
      }
    });
  };
  return (
    <div>
      <PageTitle title="Избранное">
        <ToggleBoughtVisibilityFavorites
          shownBoughtFavorites={shownBoughtFavorites}
          onChangeVisibility={handleFavoritesVisibility}
        />
      </PageTitle>
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
    </div>
  );
}

export { FavoritesPageClient };
