"use client";

import type { Position as PositionType } from "@/types/pricelist";
import PriceListGoods from "@/app/components/PriceList/PriceListGoods";
import type { Favorite } from "@/types/user";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { DiffsCollection as DiffsCollectionType } from "@/types/diff";

type PriceListProps = {
  position: PositionType;
  favorites?: Favorite[];
  diffs?: DiffsCollectionType;
  isOpen?: boolean;
};

export default function PriceListSection({
  position,
  favorites,
  diffs,
  isOpen: isOpenDefault
}: PriceListProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="mb-3">
      <button
        onClick={toggleVisibility}
        className="items-center flex justify-start text-left w-full border-b-neutral-300 cursor-pointer border-b border-solid"
      >
        <Fa icon={isOpen ? faMinus : faPlus} className="text-xl text-[orange] relative mr-2" />
        <span className="uppercase font-bold text-xl mr-2.5">{position.title}</span>
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
