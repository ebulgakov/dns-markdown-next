"use client";

import { useState } from "react";

import { PriceListSection } from "@/app/components/price-list";
import { PageTitle } from "@/app/components/ui/page-title";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Position as PositionType } from "@/types/pricelist";
import type { Favorite } from "@/types/user";

type UpdatesProps = {
  diffNew?: PositionType;
  diffChangesPrice?: PositionType;
  diffRemoved?: PositionType;
  diffChangesProfit?: PositionType;
  isUserLoggedIn: boolean;
  userFavoritesGoods: Favorite[];
  changePriceDiff: DiffsType;
  changeProfitDiff: DiffsType;
};
function Updates({
  diffNew,
  isUserLoggedIn,
  userFavoritesGoods,
  diffChangesPrice,
  changePriceDiff,
  diffRemoved,
  diffChangesProfit,
  changeProfitDiff
}: UpdatesProps) {
  const [shownSections, setShownSections] = useState<string[]>([
    diffNew?.title || "",
    diffChangesPrice?.title || "",
    diffRemoved?.title || ""
  ]);

  const onToggleSection = (sectionId: string) => {
    setShownSections(prevState =>
      prevState.includes(sectionId)
        ? prevState.filter(id => id !== sectionId)
        : [...prevState, sectionId]
    );
  };
  return (
    <div>
      <PageTitle title="Обновления с начала дня" />
      {diffNew && (
        <PriceListSection
          onHidden={onToggleSection}
          isUserLoggedIn={isUserLoggedIn}
          isOpen={shownSections.includes(diffNew.title)}
          position={diffNew}
          favorites={userFavoritesGoods}
        />
      )}
      {diffChangesPrice && (
        <PriceListSection
          onHidden={onToggleSection}
          isUserLoggedIn={isUserLoggedIn}
          isOpen={shownSections.includes(diffChangesPrice.title)}
          position={diffChangesPrice}
          favorites={userFavoritesGoods}
          diffs={changePriceDiff}
        />
      )}
      {diffRemoved && (
        <PriceListSection
          onHidden={onToggleSection}
          isOpen={shownSections.includes(diffRemoved.title)}
          position={diffRemoved}
        />
      )}
      {diffChangesProfit && (
        <PriceListSection
          onHidden={onToggleSection}
          isUserLoggedIn={isUserLoggedIn}
          isOpen={shownSections.includes(diffChangesProfit.title)}
          position={diffChangesProfit}
          diffs={changeProfitDiff}
          favorites={userFavoritesGoods}
        />
      )}
    </div>
  );
}

export { Updates };
