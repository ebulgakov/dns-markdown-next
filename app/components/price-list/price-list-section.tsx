"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Plus, Minus, Heart, Hash } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { UserContext } from "@/app/contexts/user-context";
import { cn } from "@/app/lib/utils";
import { UserSections } from "@/types/user";
import { VisualizationHeader } from "@/types/visualization";

type PriceListSectionProps = {
  header: VisualizationHeader;
  shownHeart?: boolean;
  outerHiddenSections?: UserSections;
  onOuterToggleHiddenSection?: (section: string) => void;
};

function PriceListSection({
  header,
  shownHeart,
  outerHiddenSections,
  onOuterToggleHiddenSection
}: PriceListSectionProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const { favoriteSections, hiddenSections, onToggleFavoriteSection, onToggleHiddenSection } =
    useContext(UserContext);
  const handleCopy = async () => {
    await copyToClipboard(
      `${window.location.origin}${window.location.pathname}#${encodeURIComponent(header.title)}`
    );
    setIsTooltipOpen(true);
  };

  const handleToggleHiddenSection = (section: string) => {
    if (onOuterToggleHiddenSection) {
      onOuterToggleHiddenSection(section);
    } else if (onToggleHiddenSection) {
      onToggleHiddenSection(section);
    }
  };

  const isFavoriteSection = favoriteSections.includes(header.title);
  const currentHiddenSections = outerHiddenSections ? outerHiddenSections : hiddenSections;
  const isHiddenSection = currentHiddenSections.includes(header.title);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTooltipOpen) {
      timeout = setTimeout(() => {
        setIsTooltipOpen(false);
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isTooltipOpen]);

  return (
    <div className="bg-background flex w-full items-center justify-start gap-2 border-b border-solid border-b-neutral-300 py-3 text-left">
      <button
        type="button"
        onClick={() => handleToggleHiddenSection(header.title)}
        className="cursor-pointer after:absolute after:inset-0"
      >
        {!isHiddenSection ? <Minus className="text-accent" /> : <Plus className="text-accent" />}
      </button>

      <span className="text-lg font-bold uppercase md:text-xl">
        {header.title} &ndash; {header.itemsCount}
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
                onClick={handleCopy}
                className={cn("relative hidden cursor-pointer text-gray-300 md:block", {
                  "text-success": copiedText
                })}
              >
                <span className="sr-only">Перейти к категории {header.title}</span>
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
                onClick={() => onToggleFavoriteSection?.(header.title)}
              >
                <Heart
                  className={cn("text-favorite-section hover:fill-favorite-section-foreground", {
                    "fill-favorite-section": isFavoriteSection
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
  );
}

export { PriceListSection };
