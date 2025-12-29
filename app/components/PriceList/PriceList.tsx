"use client";

import { useSyncExternalStore } from "react";
import PriceListSection from "@/app/components/PriceList/PriceListSection";
import type { Favorite, UserSections } from "@/types/user";
import { Position as PositionType } from "@/types/pricelist";

const subscribe = () => () => {};

type CatalogProps = {
  positions: PositionType[];
  hiddenSections?: UserSections;
  favorites?: Favorite[];
};

export default function PriceList({ positions, favorites, hiddenSections }: CatalogProps) {
  // Fix React Hydration on the client side
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  return (
    <div>
      {isClient ? (
        <>
          {positions.map(position => (
            <PriceListSection
              key={position._id}
              position={position}
              favorites={favorites}
              isOpen={!hiddenSections?.includes(position.title)}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
