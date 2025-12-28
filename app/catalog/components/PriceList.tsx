"use client";

import { PriceList as PriceListType } from "@/types/pricelist";
import { useState, useSyncExternalStore } from "react";
import PriceListSection from "@/app/catalog/components/PriceListSection";

const subscribe = () => () => {};

type CatalogProps = {
  priceList: PriceListType;
};

export default function PriceList({ priceList }: CatalogProps) {
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
            <PriceListSection key={idx} position={position} />
          ))}
        </>
      ) : null}
    </div>
  );
}
