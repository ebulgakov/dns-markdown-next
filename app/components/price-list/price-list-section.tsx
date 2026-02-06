"use client";

import { Plus, Minus, Heart, Hash } from "lucide-react";
import { useContext } from "react";

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

  return (
    <section className="relative border-b border-b-neutral-300">
      <a id={`${position.title}`} className="absolute -top-[var(--nav-bar-offset)] left-0" />
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
            <a
              href={`#${position.title}`}
              title="Получить ссылку на эту категорию"
              className="relative hidden text-gray-300 md:block"
            >
              <span className="sr-only">Перейти к категории {position.title}</span>
              <Hash />
            </a>

            <button
              type="button"
              className="relative cursor-pointer"
              title={
                isFavoriteSection
                  ? "Убрать категорию из избранного"
                  : "Добавить категорию в избранное"
              }
              onClick={() => onToggleFavoriteSection?.(position.title)}
            >
              <Heart
                className={cn("text-red-500", {
                  "fill-red-500": isFavoriteSection
                })}
              />
            </button>
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
