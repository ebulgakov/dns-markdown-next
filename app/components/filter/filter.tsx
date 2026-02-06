"use client";

import { useState } from "react";

import { cn } from "@/app/lib/utils";

import { FilterContainer } from "./filter-container";
import { FilterToggle } from "./filter-toggle";

import type { PriceList } from "@/types/pricelist";
import type { UserSections } from "@/types/user";

type FilterProps = {
  priceList: PriceList;
  hiddenSections: UserSections;
  foundCount?: number;
};

function Filter({ priceList, hiddenSections, foundCount = 0 }: FilterProps) {
  const [isShownFilter, setIsShownFilter] = useState<boolean>(true);

  const sections = priceList.positions
    .map(position => position.title)
    .sort((a, b) => a.localeCompare(b));
  return (
    <>
      <div
        className={cn(
          "bg-background fixed inset-0 left-auto z-20 w-full items-center justify-center shadow-lg md:bottom-22 md:max-w-[370px] md:rounded-bl-lg",
          {
            hidden: !isShownFilter
          }
        )}
      >
        <FilterContainer
          onConfirm={() => setIsShownFilter(false)}
          hiddenSections={hiddenSections}
          sections={sections}
          foundCount={foundCount}
        />
      </div>
      <div
        className={cn("fixed right-3 bottom-3 z-20 size-10 md:size-14", {
          "top-3 md:top-auto": isShownFilter
        })}
      >
        <FilterToggle isActive={isShownFilter} onToggle={() => setIsShownFilter(prev => !prev)} />
      </div>
    </>
  );
}

export { Filter };
