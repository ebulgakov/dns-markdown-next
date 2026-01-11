"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";

import { PriceListGoods } from "./price-list-goods";

import type { DiffsCollection as DiffsCollectionType } from "@/types/diff";
import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

type PriceListProps = {
  position: PositionType;
  favorites?: Favorite[];
  diffs?: DiffsCollectionType;
  isOpen?: boolean;
};

function PriceListSection({ position, favorites, diffs, isOpen: isOpenDefault }: PriceListProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="mb-3">
      <button
        onClick={toggleVisibility}
        className="bg-background sticky top-0 z-10 flex w-full cursor-pointer items-center justify-start border-b border-solid border-b-neutral-300 text-left"
      >
        {isOpen ? <Minus className="text-accent" /> : <Plus className="text-accent" />}
        <span className="mr-2.5 ml-2 text-lg font-bold uppercase md:text-xl">{position.title}</span>
        <span className="ml-auto block text-base font-bold">{position.items.length}</span>
      </button>
      <div className="divide-y divide-gray-200">
        {isOpen &&
          position.items.map(item => (
            <PriceListGoods
              key={item._id}
              item={item}
              favorites={favorites}
              diff={diffs && diffs[item._id]}
            />
          ))}
      </div>
    </div>
  );
}

export { PriceListSection };
