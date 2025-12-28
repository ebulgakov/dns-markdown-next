"use client";

import type { Position as PositionType } from "@/types/pricelist";
import PriceListGoods from "@/app/catalog/components/PriceListGoods";

type PriceListProps = {
  position: PositionType;
};

export default function PriceListSection({ position }: PriceListProps) {
  return (
    <div>
      <h2>{position.title}</h2>
      {position.items.map((item, idx) => (
        <PriceListGoods key={idx} goods={item} />
      ))}
    </div>
  );
}
