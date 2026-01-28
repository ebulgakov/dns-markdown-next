"use client";

import { Plus, Minus } from "lucide-react";

import { PriceListGoods } from "./price-list-goods";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

type PriceListProps = {
  position: PositionType;
  loading: boolean;
  favorites?: Favorite[];
  diffs?: DiffsType;
  isOpen?: boolean;
  isUserLoggedIn?: boolean;
  onUpdate: (title: string) => void;
};

function PriceListSection({
  onUpdate,
  isUserLoggedIn,
  position,
  favorites,
  loading,
  diffs,
  isOpen
}: PriceListProps) {
  return (
    <div className="mb-3">
      <button
        disabled={loading}
        type="button"
        onClick={() => onUpdate(position.title)}
        className="bg-background sticky top-0 z-10 flex w-full cursor-pointer items-center justify-start border-b border-solid border-b-neutral-300 text-left disabled:cursor-not-allowed disabled:opacity-50"
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
              isUserLoggedIn={isUserLoggedIn}
            />
          ))}
      </div>
    </div>
  );
}

export { PriceListSection };
