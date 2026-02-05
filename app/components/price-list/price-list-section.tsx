"use client";

import { Plus, Minus, Heart } from "lucide-react";

import { cn } from "@/app/lib/utils";

import { PriceListGoods } from "./price-list-goods";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

type PriceListProps = {
  position: PositionType;
  favorites?: Favorite[];
  diffs?: DiffsType;
  isOpen?: boolean;
  isFavoriteSection?: boolean;
  isUserLoggedIn?: boolean;
  onHidden: (title: string) => void;
  onFavorite?: (title: string) => void;
};

function PriceListSection({
  onHidden,
  onFavorite,
  isUserLoggedIn,
  position,
  favorites,
  diffs,
  isOpen,
  isFavoriteSection
}: PriceListProps) {
  return (
    <div className="mb-3">
      <div className="bg-background sticky top-0 z-10 flex w-full items-center justify-start gap-2 border-b border-solid border-b-neutral-300 text-left">
        <button
          type="button"
          onClick={() => onHidden(position.title)}
          className="cursor-pointer after:absolute after:inset-0"
        >
          {isOpen ? <Minus className="text-accent" /> : <Plus className="text-accent" />}
        </button>

        <span className="text-lg font-bold uppercase md:text-xl">
          {position.title} &ndash; {position.items.length}
        </span>

        {onFavorite && (
          <button
            type="button"
            className="relative ml-auto cursor-pointer"
            onClick={() => onFavorite(position.title)}
          >
            <Heart
              className={cn("text-red-500", {
                "fill-red-500": isFavoriteSection
              })}
            />
          </button>
        )}
      </div>

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
