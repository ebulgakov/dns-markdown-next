"use client";

import type { Position as PositionType } from "@/types/pricelist";
import PriceListGoods from "@/app/components/PriceList/PriceListGoods";
import type { Favorite } from "@/types/user";

type PriceListProps = {
  position: PositionType;
  favorites?: Favorite[];
};

export default function PriceListSection({ position, favorites }: PriceListProps) {
  return (
    <div>
      <h2>{position.title}</h2>
      {position.items.map((item, idx) => (
        <PriceListGoods key={idx} item={item} favorites={favorites} />
      ))}
    </div>
  );
}
