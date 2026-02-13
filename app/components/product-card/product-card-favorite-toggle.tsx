"use client";

import { Star } from "lucide-react";
import { startTransition, useContext, useOptimistic, useState } from "react";

import { UserContext } from "@/app/contexts/user-context";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { Goods as GoodsType } from "@/types/pricelist";

type PriceListFavoriteToggleProps = {
  goods: GoodsType;
};

function ProductCardFavoriteToggle({ goods }: PriceListFavoriteToggleProps) {
  const { favorites, onAddFavorite, onRemoveFavorite } = useContext(UserContext);
  const [inFavorites, setInFavorites] = useState<boolean>(
    favorites.some(fav => fav.item.link === goods.link)
  );
  const [inFavoritesOptimistic, setInFavoritesOptimistic] = useOptimistic<boolean, boolean>(
    inFavorites,
    (_, newInFavorites) => newInFavorites
  );

  const handleRemoveFromFavorites = () => {
    if (onRemoveFavorite) {
      startTransition(async () => {
        setInFavoritesOptimistic(false);
        try {
          sendGAEvent({
            event: "pricelist_goods_remove_from_favorites",
            value: goods.title,
            category: "PriceListGoods",
            action: "click"
          });
          await onRemoveFavorite(goods.link);
          setInFavorites(false);
        } catch (error) {
          window.alert(error);
        }
      });
    }
  };
  const handleAddToFavorites = () => {
    if (onAddFavorite) {
      startTransition(async () => {
        setInFavoritesOptimistic(true);
        try {
          sendGAEvent({
            event: "pricelist_goods_add_to_favorites",
            value: goods.title,
            category: "PriceListGoods",
            action: "click"
          });
          await onAddFavorite(goods);
          setInFavorites(true);
        } catch (error) {
          window.alert(error);
        }
      });
    }
  };

  return inFavoritesOptimistic ? (
    <button
      data-testid="remove-from-favorites"
      className="text-favorite text-xl"
      title="Убрать из избранного"
      onClick={handleRemoveFromFavorites}
    >
      <Star className="fill-favorite block" />
    </button>
  ) : (
    <button
      data-testid="add-to-favorites"
      className="text-favorite block text-xl"
      title="Добавить в избранное"
      onClick={handleAddToFavorites}
    >
      <Star />
    </button>
  );
}

export { ProductCardFavoriteToggle };
