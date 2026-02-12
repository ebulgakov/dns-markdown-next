"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/app/lib/utils";

import { JumpToSectionContainer } from "./jump-to-section-container";
import { JumpToSectionToggle } from "./jump-to-section-toggle";

function JumpToSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShownContainer, setIsShownContainer] = useState<boolean>(false);

  const handleClose = () => {
    setIsShownContainer(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsShownContainer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <JumpToSectionContainer onClose={handleClose} />
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
