"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Plus, Minus, Heart, Hash } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { UserContext } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { UserSections } from "@/types/user";

import { PriceListGoods } from "./price-list-goods";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Position as PositionType } from "@/types/pricelist";

type PriceListProps = {
  position: PositionType;
  shownHeart?: boolean;
  diffs?: DiffsType;
  isUserLoggedIn?: boolean;
  outerHiddenSections?: UserSections;
  onOuterToggleHiddenSection?: (section: string) => void;
};

function PriceListSection({
  position,
  diffs,
  shownHeart,
  outerHiddenSections,
  onOuterToggleHiddenSection
}: PriceListProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const { favoriteSections, hiddenSections, onToggleFavoriteSection, onToggleHiddenSection } =
    useContext(UserContext);

  const handleToggleHiddenSection = (section: string) => {
    if (onOuterToggleHiddenSection) {
      onOuterToggleHiddenSection(section);
    } else if (onToggleHiddenSection) {
      onToggleHiddenSection(section);
    }
  };

  const isFavoriteSection = favoriteSections.includes(position.title);
  const currentHiddenSections = outerHiddenSections ? outerHiddenSections : hiddenSections;
  const isHiddenSection = currentHiddenSections.includes(position.title);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copiedText) {
      setIsTooltipOpen(true);
      timeout = setTimeout(() => {
        setIsTooltipOpen(false);
        copyToClipboard("");
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [copiedText, copyToClipboard]);

  return (
    <section className="relative border-b border-b-neutral-300">
      <a
        id={encodeURIComponent(position.title)}
        className="absolute -top-[var(--nav-bar-offset)] left-0"
      />
      <div className="bg-background sticky top-[var(--nav-bar-offset)] z-10 -mb-[1px] flex w-full items-center justify-start gap-2 border-b border-solid border-b-neutral-300 py-3 text-left">
        <button
          type="button"
          onClick={() => handleToggleHiddenSection(position.title)}
          className="cursor-pointer after:absolute after:inset-0"
        >
          {!isHiddenSection ? <Minus className="text-accent" /> : <Plus className="text-accent" />}
        </button>

        <span className="text-lg font-bold uppercase md:text-xl">
          {position.title} &ndash; {position.items.length}
        </span>

        {shownHeart && (
          <div className="ml-auto flex items-center gap-4">
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger
                asChild
                onClick={e => e.preventDefault()}
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => !copiedText && setIsTooltipOpen(false)}
              >
                <button
                  type="button"
                  title="Получить ссылку на эту категорию"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}${window.location.pathname}#${encodeURIComponent(position.title)}`
                    )
                  }
                  className={cn("relative hidden cursor-pointer text-gray-300 md:block", {
                    "text-green-500": copiedText
                  })}
                >
                  <span className="sr-only">Перейти к категории {position.title}</span>
                  <Hash />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copiedText ? "Ссылка скопирована!" : "Скопировать ссылку на эту категорию"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="relative cursor-pointer"
                  onClick={() => onToggleFavoriteSection?.(position.title)}
                >
                  <Heart
                    className={cn("text-red-500 hover:fill-red-300", {
                      "fill-red-500": isFavoriteSection
                    })}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isFavoriteSection
                    ? "Убрать категорию из избранного"
                    : "Добавить категорию в избранное"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="divide-y divide-neutral-300">
        {!isHiddenSection &&
          position.items.map(item => (
            <PriceListGoods
              key={item._id}
              shownFavorites={true}
              item={item}
              diff={diffs && diffs[item._id]}
            />
          ))}
      </div>
    </section>
  );
}

export { PriceListSection };
