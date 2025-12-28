"use client";

import type { PriceList as PriceListType } from "@/types/pricelist";
import { useState, useSyncExternalStore } from "react";
import PriceListSection from "@/app/catalog/components/PriceListSection";
import type { Favorite } from "@/types/user";

const subscribe = () => () => {};

type CatalogProps = {
  priceList: PriceListType;
  favorites?: Favorite[];
};

export default function PriceList({ priceList, favorites }: CatalogProps) {
  const [isShowingFavorites, setIsShowingFavorites] = useState<boolean>(false);
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
