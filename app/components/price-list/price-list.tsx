"use client";

import { useOptimistic, startTransition, useState } from "react";

import {
  postAddToFavoriteSections,
  postAddToHiddenSections,
  postRemoveFromFavoriteSection,
  postRemoveFromHiddenSections
} from "@/api/post";

import { PriceListSection } from "./price-list-section";

import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";

type CatalogProps = {
  positions: PositionType[];
  hiddenSections?: UserSections;
  favoriteSections?: UserSections;
  favorites?: Favorite[];
};

function PriceList({
  positions,
  favorites,
  favoriteSections: fSections = [],
  hiddenSections: hSections = []
}: CatalogProps) {
  const [realHiddenSections, setRealHiddenSections] = useState<UserSections>(hSections);
  const [hiddenSections, setHiddenSections] = useOptimistic<UserSections, UserSections>(
    realHiddenSections,
    (_, newSections) => newSections
  );
  const [realFavoriteSections, setRealFavoriteSections] = useState<UserSections>(fSections);
  const [favoriteSections, setFavoriteSections] = useOptimistic<UserSections, UserSections>(
    realFavoriteSections,
    (_, newSections) => newSections
  );

  const onHidden = (title: string) => {
    const updatedSections = hiddenSections.includes(title)
      ? hiddenSections.filter(section => section !== title)
      : [...hiddenSections, title];

    startTransition(async () => {
      setHiddenSections(updatedSections);
      try {
        let result;
        if (updatedSections.includes(title)) {
          result = await postAddToHiddenSections(title);
        } else {
          result = await postRemoveFromHiddenSections(title);
        }

        if (!result) throw new Error("No data returned from server");
        setRealHiddenSections(result.sections);
      } catch (error) {
        console.error("Failed to update hidden sections:", error);
      }
    });
  };

  const onFavorite = (title: string) => {
    const updatedSections = favoriteSections.includes(title)
      ? favoriteSections.filter(section => section !== title)
      : [...favoriteSections, title].sort();

    startTransition(async () => {
      setFavoriteSections(updatedSections);
      try {
        let result;
        if (updatedSections.includes(title)) {
          result = await postAddToFavoriteSections(title);
        } else {
          result = await postRemoveFromFavoriteSection(title);
        }

        if (!result) throw new Error("No data returned from server");
        setRealFavoriteSections(result.sections);
      } catch (error) {
        console.error("Failed to update favorite sections:", error);
      }
    });
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
    />
  ));
}

export { PriceList };
