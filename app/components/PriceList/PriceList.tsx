"use client";

import { useSyncExternalStore } from "react";
import PriceListSection from "@/app/components/PriceList/PriceListSection";
import type { Favorite, UserSections } from "@/types/user";
import type { PriceList as PriceListType } from "@/types/pricelist";

const subscribe = () => () => {};

type CatalogProps = {
  priceList: PriceListType;
  hiddenSections?: UserSections;
  favorites?: Favorite[];
};

export default function PriceList({ priceList, favorites, hiddenSections }: CatalogProps) {
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
          {priceList.positions.map((position, idx) => (
            <PriceListSection
              key={idx}
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
