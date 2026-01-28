"use client";
import { startTransition, useEffect, useOptimistic, useState } from "react";

import { updateUserSection } from "@/db/user/mutations/update-user-section";

import { PriceListSection } from "./price-list-section";

import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";

type CatalogProps = {
  positions: PositionType[];
  hiddenSections?: UserSections;
  favorites?: Favorite[];
  isUserLoggedIn?: boolean;
};

function PriceList({ positions, favorites, hiddenSections = [], isUserLoggedIn }: CatalogProps) {
  const [realHiddenSections, setRealHiddenSections] = useState<UserSections>(hiddenSections);

  const [stateHiddenSections, toggleOptimisticHiddenSection] = useOptimistic<UserSections, string>(
    realHiddenSections,
    (state, newSection) =>
      state.includes(newSection)
        ? state.filter(section => section !== newSection)
        : [...state, newSection]
  );

  const onUpdate = (title: string) => {
    startTransition(async () => {
      toggleOptimisticHiddenSection(title);
      const updatedSections = realHiddenSections.includes(title)
        ? realHiddenSections.filter(section => section !== title)
        : [...realHiddenSections, title];
      if (isUserLoggedIn) {
        try {
          const list = await updateUserSection(updatedSections, "hiddenSections");
          setRealHiddenSections(list as UserSections);
        } catch (error) {
          console.error("Failed to update hidden sections:", error);
        }
      } else {
        setRealHiddenSections(updatedSections);
      }
    });
  };

  return positions.map(position => (
    <PriceListSection
      key={position._id}
      position={position}
      favorites={favorites}
      isOpen={!stateHiddenSections?.includes(position.title)}
      onUpdate={onUpdate}
      isUserLoggedIn={isUserLoggedIn}
    />
  ));
}

export { PriceList };
