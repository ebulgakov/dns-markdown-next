"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { UserContext } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { usePriceListStore } from "@/app/stores/pricelist-store";

import { JumpToSectionContainer } from "./jump-to-section-container";
import { JumpToSectionToggle } from "./jump-to-section-toggle";

function JumpToSection() {
  const { getPriceSections } = usePriceListStore(
    useShallow(state => ({
      getPriceSections: state.getPriceSections
    }))
  );

  const { favoriteSections, hiddenSections } = useContext(UserContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShownContainer, setIsShownContainer] = useState<boolean>(false);

  const sections = getPriceSections().sort((a, b) => {
    const isHiddenA = hiddenSections.includes(a);
    const isHiddenB = hiddenSections.includes(b);
    const isFavoriteA = favoriteSections.includes(a);
    const isFavoriteB = favoriteSections.includes(b);

    if (isFavoriteA && !isFavoriteB) return -1;
    if (!isFavoriteA && isFavoriteB) return 1;

    if (isHiddenA && !isHiddenB) return 1;
    if (!isHiddenA && isHiddenB) return -1;

    return a.localeCompare(b);
  });

  const handleClose = useCallback(() => {
    setIsShownContainer(false);
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
          "bg-background fixed inset-0 left-auto z-20 w-full items-center justify-center shadow-lg transition-all duration-300 ease-in-out md:bottom-20 md:max-w-[370px] md:rounded-bl-lg",
          {
            "invisible opacity-0": !isShownContainer,
            "visible opacity-100": isShownContainer
          }
        )}
      >
        <JumpToSectionContainer onClose={handleClose} sections={sections} />
      </div>
      <div
        className={cn("fixed right-3 bottom-3 z-20 size-10 md:size-14", {
          "top-3 md:top-auto": isShownContainer
        })}
      >
        <JumpToSectionToggle
          isActive={isShownContainer}
          onToggle={() => setIsShownContainer(prev => !prev)}
        />
      </div>
    </div>
  );
}

export { JumpToSection };
