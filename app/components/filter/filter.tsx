"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShownFilter, setIsShownFilter] = useState<boolean>(false);

  const sections = priceList.positions
    .map(position => position.title)
    .sort((a, b) => {
      const isHiddenA = hiddenSections.includes(a);
      const isHiddenB = hiddenSections.includes(b);

      if (isHiddenA && !isHiddenB) return 1;
      if (!isHiddenA && isHiddenB) return -1;

      return a.localeCompare(b);
    });

  const handleClose = useCallback(() => {
    setIsShownFilter(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div ref={containerRef}>
      <div
        className={cn(
          "bg-background fixed inset-0 left-auto z-20 w-full items-center justify-center shadow-lg md:bottom-22 md:max-w-[370px] md:rounded-bl-lg",
          {
            hidden: !isShownFilter
          }
        )}
      >
        <FilterContainer
          onClose={handleClose}
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
    </div>
  );
}

export { Filter };
