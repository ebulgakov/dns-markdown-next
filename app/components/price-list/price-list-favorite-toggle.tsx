"use client";

import { Star } from "lucide-react";
import { useState, useOptimistic, startTransition } from "react";

import { postAddToFavorites, postRemoveFromFavorites } from "@/api/user";
import { useGuestData } from "@/app/hooks/use-guest-data";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

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
  const { addToGuestFavorites, removeFromGuestFavorites, guestData } = useGuestData();
  const baseFavorites = isUserLoggedIn ? favorites : guestData.favorites;
  const [inFavorites, setInFavorites] = useState<boolean>(
    baseFavorites.some(fav => fav.item.link === goods.link)
  );
  const [inFavoritesOptimistic, setInFavoritesOptimistic] = useOptimistic<boolean, boolean>(
    inFavorites,
    (_, newInFavorites) => newInFavorites
  );

  const handleRemoveFromFavorites = () => {
    if (isUserLoggedIn) {
      startTransition(async () => {
        setInFavoritesOptimistic(false);
        try {
          const removed = await postRemoveFromFavorites(goods.link);
          if (removed) {
            setInFavorites(false);
            sendGAEvent({
              event: "pricelist_goods_remove_from_favorites",
              value: goods.title,
              category: "PriceListGoods",
              action: "click"
            });
          }
        } catch (error) {
          window.alert(error);
        }
      });
    } else {
      setInFavoritesOptimistic(false);
      setInFavorites(false);
      removeFromGuestFavorites(goods.link);
    }
  };
  const handleAddToFavorites = () => {
    if (isUserLoggedIn) {
      startTransition(async () => {
        setInFavoritesOptimistic(true);
        try {
          const added = await postAddToFavorites(goods);
          if (added) {
            setInFavorites(true);
            sendGAEvent({
              event: "pricelist_goods_add_to_favorites",
              value: goods.title,
              category: "PriceListGoods",
              action: "click"
            });
          }
        } catch (error) {
          window.alert(error);
        }
      });
    } else {
      setInFavoritesOptimistic(true);
      setInFavorites(true);
      addToGuestFavorites(goods);
    }
  };

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
