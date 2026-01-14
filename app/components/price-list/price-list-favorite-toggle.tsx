"use client";

import { Star } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";
import { addToFavorites } from "@/db/user/mutations/add-to-favorites";
import { removeFromFavorites } from "@/db/user/mutations/remove-from-favorites";

import type { Goods as GoodsType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

type PriceListFavoriteToggleProps = {
  favorites: Favorite[];
  goods: GoodsType;
  isUserLoggedIn?: boolean;
};

function PriceListFavoriteToggle({
  favorites,
  goods,
  isUserLoggedIn
}: PriceListFavoriteToggleProps) {
  const [inFavorites, setInFavorites] = useState<boolean>(
    favorites.some(fav => fav.item.link === goods.link)
  );
  const [inFavoritesOptimistic, setInFavoritesOptimistic] = useOptimistic<boolean, boolean>(
    inFavorites,
    (_, newInFavorites) => newInFavorites
  );
  const [, startTransition] = useTransition();

  const handleRemoveFromFavorites = () => {
    startTransition(async () => {
      setInFavoritesOptimistic(false);
      try {
        const removed = await removeFromFavorites(goods.link);
        if (removed) setInFavorites(false);
      } catch (error) {
        window.alert(error);
      }
    });
  };
  const handleAddToFavorites = () => {
    startTransition(async () => {
      setInFavoritesOptimistic(true);
      try {
        const added = await addToFavorites(goods);
        if (added) setInFavorites(true);
      } catch (error) {
        window.alert(error);
      }
    });
  };

  if (!isUserLoggedIn) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="text-favorite text-xl opacity-50">
            <Star />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Чтобы добавлять товары в избранное, <br /> нужно авторизоваться
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return inFavoritesOptimistic ? (
    <button
      data-testid="remove-from-favorites"
      className="text-favorite text-xl"
      title="Убрать из избранного"
      onClick={handleRemoveFromFavorites}
    >
      <Star className="fill-favorite" />
    </button>
  ) : (
    <button
      data-testid="add-to-favorites"
      className="text-favorite text-xl"
      title="Добавить в избранное"
      onClick={handleAddToFavorites}
    >
      <Star />
    </button>
  );
}

export { PriceListFavoriteToggle };
