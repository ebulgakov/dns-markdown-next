"use client";

import { Star } from "lucide-react";
import { useContext } from "react";

import { UserContext } from "@/app/contexts/user-context";
import { sendGAEvent } from "@/app/lib/sendGAEvent";

import type { Goods as GoodsType } from "@/types/pricelist";

type PriceListFavoriteToggleProps = {
  goods: GoodsType;
};

function ProductCardFavoriteToggle({ goods }: PriceListFavoriteToggleProps) {
  const { favorites, onAddFavorite, onRemoveFavorite, loadingStates } = useContext(UserContext);
  const loading = loadingStates?.includes(`favorite-${goods.link}`);
  const inFavorites = favorites.some(fav => fav.item.link === goods.link);

  const handleRemoveFromFavorites = () => {
    if (onRemoveFavorite) {
      sendGAEvent({
        event: "pricelist_goods_remove_from_favorites",
        value: goods.title,
        category: "PriceListGoods",
        action: "click"
      });
      onRemoveFavorite(goods.link);
    }
  };
  const handleAddToFavorites = () => {
    if (onAddFavorite) {
      sendGAEvent({
        event: "pricelist_goods_add_to_favorites",
        value: goods.title,
        category: "PriceListGoods",
        action: "click"
      });
      onAddFavorite(goods);
    }
  };

  return inFavorites ? (
    <button
      data-testid="remove-from-favorites"
      disabled={loading}
      className="text-favorite text-xl disabled:cursor-not-allowed disabled:opacity-50"
      title="Убрать из избранного"
      onClick={handleRemoveFromFavorites}
    >
      <Star className="fill-favorite block" />
    </button>
  ) : (
    <button
      disabled={loading}
      data-testid="add-to-favorites"
      className="text-favorite block text-xl disabled:cursor-not-allowed disabled:opacity-50"
      title="Добавить в избранное"
      onClick={handleAddToFavorites}
    >
      <Star />
    </button>
  );
}

export { ProductCardFavoriteToggle };
