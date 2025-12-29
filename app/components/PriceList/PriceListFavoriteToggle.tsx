"use client";
import axios from "axios";
import cn from "classnames";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import type { Goods as GoodsType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

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
  const removeFromFavorites = async () => {
    setLoadingFavoritesList(true);
    try {
      const { data } = await axios.post(
        "/api/remove-from-favorites",
        { id: goods.id },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      );

      if (data.success) {
        setInFavorites(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFavoritesList(false);
    }
  };
  const addToFavorites = async () => {
    setLoadingFavoritesList(true);
    try {
      const { data } = await axios.post(
        "/api/add-to-favorites",
        { goods },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        }
      );

      if (data.success) {
        setInFavorites(true);
      }
    } catch (e) {
      console.error(e);
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
          onClick={removeFromFavorites}
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
          onClick={addToFavorites}
        >
          <Fa icon={faStarEmpty} />
        </button>
      )}
    </>
  );
}
