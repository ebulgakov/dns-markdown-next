"use client";
import cn from "classnames";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
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
  const [loadingFavoritesList, setLoadingFavoritesList] = useState<boolean>();

  const handleRemoveFromFavorites = async () => {
    try {
      setLoadingFavoritesList(true);
      const removed = await removeFromFavorites(goods.link);
      if (removed) setInFavorites(false);
    } catch (error) {
      window.alert(error);
    } finally {
      setLoadingFavoritesList(false);
    }
  };
  const handleAddToFavorites = async () => {
    try {
      setLoadingFavoritesList(true);
      const added = await addToFavorites(goods);
      if (added) setInFavorites(true);
    } catch (error) {
      window.alert(error);
    } finally {
      setLoadingFavoritesList(false);
    }
  };

  return (
    <>
      {inFavorites ? (
        <button
          className={cn("text-xl text-[#ffc529]", {
            "opacity-40": loadingFavoritesList
          })}
          title="Убрать из избранного"
          disabled={loadingFavoritesList}
          onClick={handleRemoveFromFavorites}
        >
          <Fa icon={faStar} />
        </button>
      ) : (
        <button
          className={cn("text-xl text-[#ffc529]", {
            "opacity-40": loadingFavoritesList
          })}
          title="Добавить в избранное"
          disabled={loadingFavoritesList}
          onClick={handleAddToFavorites}
        >
          <Fa icon={faStarEmpty} />
        </button>
      )}
    </>
  );
}
