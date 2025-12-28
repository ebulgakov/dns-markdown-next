"use client";

import { PriceList as PriceListType } from "@/types/pricelist";
import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};

type CatalogProps = {
  priceList: PriceListType;
};

export default function CatalogSection({ priceList }: CatalogProps) {
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
          {isShowingFavorites} {JSON.stringify(priceList, null, 2)}
        </>
      ) : null}
    </div>
  );
}
