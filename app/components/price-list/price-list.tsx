"use client";
import { useTransition, useState } from "react";

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

function PriceList({
  positions,
  favorites,
  hiddenSections: hSections = [],
  isUserLoggedIn
}: CatalogProps) {
  const [currentSave, setCurrentSave] = useState<string | null>(null);
  const [hiddenSections, setHiddenSections] = useState<UserSections>(hSections);
  const [isPending, startTransition] = useTransition();

  const onUpdate = (title: string) => {
    setCurrentSave(title);

    startTransition(async () => {
      const updatedSections = hiddenSections.includes(title)
        ? hiddenSections.filter(section => section !== title)
        : [...hiddenSections, title];
      if (isUserLoggedIn) {
        try {
          const list = await updateUserSection(updatedSections, "hiddenSections");
          setHiddenSections(list as UserSections);
        } catch (error) {
          console.error("Failed to update hidden sections:", error);
        }
      } else {
        setHiddenSections(updatedSections);
      }
    });
  };

  return positions.map(position => (
    <PriceListSection
      key={position._id}
      position={position}
      favorites={favorites}
      isOpen={!hiddenSections?.includes(position.title)}
      loading={isPending && currentSave === position.title}
      onUpdate={onUpdate}
      isUserLoggedIn={isUserLoggedIn}
    />
  ));
}

export { PriceList };
