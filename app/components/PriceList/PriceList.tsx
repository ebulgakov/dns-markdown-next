"use client";
import PriceListSection from "@/app/components/PriceList/PriceListSection";
import type { Favorite, UserSections } from "@/types/user";
import { Position as PositionType } from "@/types/pricelist";
import { useClientRendering } from "@/app/hooks/useClientRendering";

type CatalogProps = {
  positions: PositionType[];
  hiddenSections?: UserSections;
  favorites?: Favorite[];
};

export default function PriceList({ positions, favorites, hiddenSections }: CatalogProps) {
  const isClient = useClientRendering();
  if (!isClient) return null;

  return positions.map(position => (
    <PriceListSection
      key={position._id}
      position={position}
      favorites={favorites}
      isOpen={!hiddenSections?.includes(position.title)}
    />
  ));
}
