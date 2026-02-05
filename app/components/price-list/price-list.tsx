"use client";

import { useOptimistic, startTransition } from "react";

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
  const [hiddenSections, setHiddenSections] = useOptimistic<UserSections, UserSections>(
    hSections,
    (_, newSections) => newSections
  );
  const [favoriteSections, setFavoriteSections] = useOptimistic<UserSections, UserSections>(
    fSections,
    (_, newSections) => newSections
  );

  const onHidden = (title: string) => {
    const updatedSections = hiddenSections.includes(title)
      ? hiddenSections.filter(section => section !== title)
      : [...hiddenSections, title];

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
        let list;

        if (updatedSections.includes(title)) {
          list = await postAddToFavoriteSections(title);
        } else {
          list = await postRemoveFromFavoriteSection(title);
        }

        if (!list) throw new Error("No data returned from server");
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
