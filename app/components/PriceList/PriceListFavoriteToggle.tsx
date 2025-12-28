"use client";

import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

type PriceListFavoriteToggleProps = {
  favorites: Favorite[];
  goods: GoodsType;
}

export default function PriceListFavoriteToggle({favorites, goods}: PriceListFavoriteToggleProps) {

  const inFavorites = favorites.some(fav => fav.item._id === goods._id);
  const [loadingFavoritesList, setLoadingFavoritesList] = useState<boolean>();
  const removeFromFavorites = () => {
    setLoadingFavoritesList(true);
  };
  const addToFavorites = () => {
    setLoadingFavoritesList(true);
  };


  return (
    <>
      {inFavorites ? (
        <button
          className="text-xl text-[#ffc529]"
          title="Убрать из избранного"
          disabled={loadingFavoritesList}
          onClick={removeFromFavorites}
        >
          <Fa icon={faStar} />
        </button>
      ) : (
        <button
          className="text-xl text-[#ffc529]"
          title="Добавить в избранное"
          disabled={loadingFavoritesList}
          onClick={addToFavorites}
        >
          <Fa icon={faStarEmpty} />
        </button>
      )}
    </>
  );
}
