"use client";

import { useState } from "react";

import { PriceListSection } from "@/app/components/price-list";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserSections } from "@/types/user";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Position as PositionType } from "@/types/pricelist";

type UpdatesProps = {
  diffNew?: PositionType;
  diffChangesPrice?: PositionType;
  diffRemoved?: PositionType;
  diffChangesProfit?: PositionType;
  changePriceDiff: DiffsType;
  changeProfitDiff: DiffsType;
};
function Updates({
  diffNew,
  diffChangesPrice,
  changePriceDiff,
  diffRemoved,
  diffChangesProfit,
  changeProfitDiff
}: UpdatesProps) {
  const [hiddenSections, setHiddenSections] = useState<UserSections>([
    diffChangesProfit?.title || ""
  ]);

  const onToggleSection = (sectionId: string) => {
    setHiddenSections(prevState =>
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
          outerHiddenSections={hiddenSections}
          onOuterToggleHiddenSection={onToggleSection}
          position={diffNew}
        />
      )}
      {diffChangesPrice && (
        <PriceListSection
          outerHiddenSections={hiddenSections}
          onOuterToggleHiddenSection={onToggleSection}
          position={diffChangesPrice}
          diffs={changePriceDiff}
        />
      )}
      {diffRemoved && (
        <PriceListSection
          outerHiddenSections={hiddenSections}
          onOuterToggleHiddenSection={onToggleSection}
          position={diffRemoved}
        />
      )}
      {diffChangesProfit && (
        <PriceListSection
          outerHiddenSections={hiddenSections}
          onOuterToggleHiddenSection={onToggleSection}
          position={diffChangesProfit}
          diffs={changeProfitDiff}
        />
      )}

      <ScrollToTop />
    </div>
  );
}

export { Updates };
