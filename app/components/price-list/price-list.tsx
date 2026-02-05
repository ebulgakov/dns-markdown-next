"use client";
import { useOptimistic, useState, startTransition } from "react";

import {
  postAddToFavoriteSections,
  postAddToHiddenSections,
  postRemoveFromFavoriteSection,
  postRemoveFromHiddenSections
} from "@/api/user";

import { PriceListSection } from "./price-list-section";

import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite, UserSections as UserSectionsType, UserSections } from "@/types/user";

type CatalogProps = {
  positions: PositionType[];
  hiddenSections?: UserSections;
  favoriteSections?: UserSections;
  favorites?: Favorite[];
  isUserLoggedIn?: boolean;
};

function PriceList({
  positions,
  favorites,
  favoriteSections: fSections = [],
  hiddenSections: hSections = [],
  isUserLoggedIn
}: CatalogProps) {
  // Hidden sections state management
  const [realHiddenSections, setRealHiddenSections] = useState<UserSectionsType>(hSections);
  const [hiddenSections, setHiddenSections] = useOptimistic<UserSections, UserSections>(
    realHiddenSections,
    (_, newSections) => newSections
  );

  // Favorite sections state management
  const [realFavoriteSections, setRealFavoriteSections] = useState<UserSectionsType>(fSections);
  const [favoriteSections, setFavoriteSections] = useOptimistic<UserSections, UserSections>(
    realFavoriteSections,
    (_, newSections) => newSections
  );

  const onHidden = (title: string) => {
    const updatedSections = hiddenSections.includes(title)
      ? hiddenSections.filter(section => section !== title)
      : [...hiddenSections, title];

    if (isUserLoggedIn) {
      startTransition(async () => {
        setHiddenSections(updatedSections);
        try {
          let list;

          if (updatedSections.includes(title)) {
            list = await postAddToHiddenSections(title);
          } else {
            list = await postRemoveFromHiddenSections(title);
          }
          if (!list) throw new Error("No data returned from server");

          setRealHiddenSections(list.sections);
        } catch (error) {
          console.error("Failed to update hidden sections:", error);
        }
      });
    } else {
      setRealHiddenSections(updatedSections);
    }
  };

  const onFavorite = (title: string) => {
    const updatedSections = favoriteSections.includes(title)
      ? favoriteSections.filter(section => section !== title)
      : [...favoriteSections, title];

    if (isUserLoggedIn) {
      startTransition(async () => {
        setFavoriteSections(updatedSections);
        try {
          let list;

          if (updatedSections.includes(title)) {
            list = await postAddToFavoriteSections(title);
          } else {
            list = await postRemoveFromFavoriteSection(title);
          }

          if (!list) throw new Error("No data returned from server");

          setRealFavoriteSections(list.sections);
        } catch (error) {
          console.error("Failed to update favorite sections:", error);
        }
      });
    }
  };

  return positions.map(position => (
    <PriceListSection
      key={position._id}
      position={position}
      favorites={favorites}
      isOpen={!hiddenSections.includes(position.title)}
      isFavoriteSection={favoriteSections.includes(position.title)}
      onHidden={onHidden}
      onFavorite={onFavorite}
      isUserLoggedIn={isUserLoggedIn}
    />
  ));
}

export { PriceList };
