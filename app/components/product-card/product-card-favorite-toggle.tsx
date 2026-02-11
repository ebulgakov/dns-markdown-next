"use client";

import { Star } from "lucide-react";
import { useState, useOptimistic, startTransition, useContext } from "react";

import { postAddToFavorites, postRemoveFromFavorites } from "@/api/post";
import { UserContext } from "@/app/contexts/user-context";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { Goods as GoodsType } from "@/types/pricelist";

type PriceListFavoriteToggleProps = {
  goods: GoodsType;
};

function ProductCardFavoriteToggle({ goods }: PriceListFavoriteToggleProps) {
  const { favorites } = useContext(UserContext);
  const [inFavorites, setInFavorites] = useState<boolean>(
    favorites.some(fav => fav.item.link === goods.link)
  );
  const [inFavoritesOptimistic, setInFavoritesOptimistic] = useOptimistic<boolean, boolean>(
    inFavorites,
    (_, newInFavorites) => newInFavorites
  );

  const handleRemoveFromFavorites = () => {
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
  };
  const handleAddToFavorites = () => {
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
