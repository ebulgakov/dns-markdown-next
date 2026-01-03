"use client";
import cn from "classnames";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState, useTransition } from "react";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";
import { addToFavorites } from "@/db/profile/mutations/add-to-favorites";
import { removeFromFavorites } from "@/db/profile/mutations/remove-from-favorites";

type PriceListFavoriteToggleProps = {
  favorites: Favorite[];
  goods: GoodsType;
};

export default function PriceListFavoriteToggle({
  favorites,
  goods
}: PriceListFavoriteToggleProps) {
  const [inFavorites, setInFavorites] = useState<boolean>(
    favorites.some(fav => fav.item.link === goods.link)
  );
  const [isPending, startTransition] = useTransition();

  const handleRemoveFromFavorites = () => {
    startTransition(async () => {
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
      {inFavorites ? (
        <button
          className={cn("text-xl text-[#ffc529]", {
            "opacity-40": isPending
          })}
          title="Убрать из избранного"
          disabled={isPending}
          onClick={handleRemoveFromFavorites}
        >
          <Fa icon={faStar} />
        </button>
      ) : (
        <button
          className={cn("text-xl text-[#ffc529]", {
            "opacity-40": isPending
          })}
          title="Добавить в избранное"
          disabled={isPending}
          onClick={handleAddToFavorites}
        >
          <Fa icon={faStarEmpty} />
        </button>
      )}
    </>
  );
}
