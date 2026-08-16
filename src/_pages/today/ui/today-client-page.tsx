"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePriceListStore } from "@/entities/product";
import { UserContext } from "@/entities/user";
import { Catalog } from "@/features/product-catalog";
import { useFilteredGoods } from "@/features/sort-goods";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PageLoader } from "@/shared/ui/page-loader";
import { PageTitle } from "@/shared/ui/page-title";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";
import { AnalysisDiff } from "@/types/analysis-diff";

import { transformDiffData } from "../lib/transform-diff-data";

function TodayClientPage() {
  const { city } = useContext(UserContext);
  const { updatePriceList, priceListCreatedDate, updatePriceListDiffs } = usePriceListStore(
    useShallow(state => ({
      priceListCreatedDate: state.getPriceListCreatedDate(),
      updatePriceListDiffs: state.updatePriceListDiffs,
      updatePriceList: state.updatePriceList
    }))
  );

  const {
    data: diff,
    isPending,
    error
  } = useQuery({
    queryKey: ["today-diff", city],
    queryFn: (): Promise<AnalysisDiff> =>
      axios.get("/api/today-diff", { params: { city } }).then(r => r.data)
  });

  useEffect(() => {
    if (diff) {
      const diffData = transformDiffData(diff, city);
      updatePriceList(diffData.digestList);
      updatePriceListDiffs(diffData.diffs);
    }
  }, [diff, city, updatePriceList, updatePriceListDiffs]);

  const { flattenList, flattenTitles } = useFilteredGoods({
    filterTerm: "",
    hasNoModifyOutput: true
  });

  if (isPending) return <PageLoader />;

  if (error || !diff)
    return <ErrorAlert title="Ошибка загрузки каталога" message={error?.message} />;

  return (
    <>
      <PageTitle title={`Обновления на ${priceListCreatedDate}`} />
      <Catalog
        variant="updates"
        flattenList={flattenList}
        flattenTitles={flattenTitles}
        disabledCollapse={false}
      />
      <ScrollToTop />
    </>
  );
}

export { TodayClientPage };
