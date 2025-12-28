"use client";

import { useSyncExternalStore } from "react";
import PriceListSection from "@/app/components/PriceList/PriceListSection";
import type { Favorite } from "@/types/user";
import type { PriceList as PriceListType } from "@/types/pricelist";

const subscribe = () => () => {};

type CatalogProps = {
  priceList: PriceListType;
  favorites?: Favorite[];
};

export default function PriceList({ priceList, favorites }: CatalogProps) {
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
            <PriceListSection key={idx} position={position} favorites={favorites} />
          ))}
        </>
      ) : null}
    </div>
  );
}
