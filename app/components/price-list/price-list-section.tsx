"use client";

import type { Position as PositionType } from "@/types/pricelist";
import { PriceListGoods } from "./price-list-goods";
import type { Favorite } from "@/types/user";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { DiffsCollection as DiffsCollectionType } from "@/types/diff";

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
        className="sticky top-0 bg-white z-10 items-center flex justify-start text-left w-full border-b-neutral-300 cursor-pointer border-b border-solid"
      >
        {isOpen ? <Minus className="text-accent" /> : <Plus className="text-accent" />}
        <span className="uppercase font-bold text-xl ml-2 mr-2.5">{position.title}</span>
        <span className="text-base block font-bold ml-auto">{position.items.length}</span>
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
