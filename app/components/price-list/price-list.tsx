"use client";
import { useTransition, useOptimistic, useState } from "react";

import { updateUserSection } from "@/db/user/mutations/update-user-section";

import { PriceListSection } from "./price-list-section";

import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite, UserSections as UserSectionsType, UserSections } from "@/types/user";

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
  const [realHiddenSections, setRealHiddenSections] = useState<UserSectionsType>(hSections);
  const [hiddenSections, setHiddenSections] = useOptimistic<UserSections, UserSections>(
    realHiddenSections,
    (_, newSections) => newSections
  );
  const [isPending, startTransition] = useTransition();

  const onUpdate = (title: string) => {
    setCurrentSave(title);

    const updatedSections = hiddenSections.includes(title)
      ? hiddenSections.filter(section => section !== title)
      : [...hiddenSections, title];

    if (isUserLoggedIn) {
      startTransition(async () => {
        setHiddenSections(updatedSections);
        try {
          const list = await updateUserSection(updatedSections, "hiddenSections");
          setRealHiddenSections(list as UserSections);
        } catch (error) {
          console.error("Failed to update hidden sections:", error);
        }
      });
    } else {
      setRealHiddenSections(updatedSections);
    }
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
