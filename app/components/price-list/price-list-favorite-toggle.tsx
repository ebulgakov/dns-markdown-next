"use client";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState, useTransition, useOptimistic } from "react";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";
import { addToFavorites } from "@/db/user/mutations/add-to-favorites";
import { removeFromFavorites } from "@/db/user/mutations/remove-from-favorites";

type PriceListFavoriteToggleProps = {
  favorites: Favorite[];
  goods: GoodsType;
};

function PriceListFavoriteToggle({ favorites, goods }: PriceListFavoriteToggleProps) {
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

  return (
    <>
      {inFavoritesOptimistic ? (
        <button
          className="text-xl text-[#ffc529]"
          title="Убрать из избранного"
          onClick={handleRemoveFromFavorites}
        >
          <Fa icon={faStar} />
        </button>
      ) : (
        <button
          className="text-xl text-[#ffc529]"
          title="Добавить в избранное"
          onClick={handleAddToFavorites}
        >
          <Fa icon={faStarEmpty} />
        </button>
      )}
    </>
  );
}

export { PriceListFavoriteToggle };
