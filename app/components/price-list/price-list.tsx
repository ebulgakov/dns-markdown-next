"use client";
import { PriceListSection } from "./price-list-section";

import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";

type CatalogProps = {
  positions: PositionType[];
  hiddenSections?: UserSections;
  favorites?: Favorite[];
  isUserLoggedIn?: boolean;
};

function PriceList({ positions, favorites, hiddenSections, isUserLoggedIn }: CatalogProps) {
  return positions.map(position => (
    <PriceListSection
      key={position._id}
      position={position}
      favorites={favorites}
      isOpen={!hiddenSections?.includes(position.title)}
      isUserLoggedIn={isUserLoggedIn}
    />
  ));
}

export { PriceList };
