"use client";

import { useState } from "react";

import { FilterContainer } from "./filter-container";
import { FilterToggle } from "./filter-toggle";

import type { PriceList } from "@/types/pricelist";
import type { UserSections } from "@/types/user";

type FilterProps = {
  priceList: PriceList;
  hiddenSections: UserSections;
};

function Filter({ priceList, hiddenSections }: FilterProps) {
  const [isShownFilter, setIsShownFilter] = useState<boolean>(true);

  const sections = priceList.positions
    .map(position => position.title)
    .sort((a, b) => a.localeCompare(b));
  return (
    <>
      {isShownFilter && (
        <div className="bg-background fixed inset-0 bottom-22 left-auto z-20 w-full max-w-[370px] items-center justify-center rounded-bl-lg shadow-lg">
          <FilterContainer hiddenSections={hiddenSections} sections={sections} />
        </div>
      )}
      <div className="fixed right-3 bottom-3 z-20 size-14">
        <FilterToggle isActive={isShownFilter} onToggle={() => setIsShownFilter(prev => !prev)} />
      </div>
    </>
  );
}

export { Filter };
