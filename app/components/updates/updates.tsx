"use client";

import { useContext, useState } from "react";

import { PriceListSection } from "@/app/components/price-list";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { PageTitle } from "@/app/components/ui/page-title";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Position as PositionType } from "@/types/pricelist";
import { UserContext } from "@/app/contexts/user-context";

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
      {diffNew && <PriceListSection position={diffNew} />}
      {diffChangesPrice && <PriceListSection position={diffChangesPrice} diffs={changePriceDiff} />}
      {diffRemoved && <PriceListSection position={diffRemoved} />}
      {diffChangesProfit && (
        <PriceListSection position={diffChangesProfit} diffs={changeProfitDiff} />
      )}

      <ScrollToTop />
    </div>
  );
}

export { Updates };
