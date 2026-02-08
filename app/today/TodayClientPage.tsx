"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";

import { Catalog } from "@/app/components/catalog";
import { PageLoader } from "@/app/components/page-loader";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserContext } from "@/app/contexts/user-context";
import { AnalysisDiff, DiffsCollection as DiffsType } from "@/types/analysis-diff";
import { Position, PriceList } from "@/types/pricelist";
import { UserSections } from "@/types/user";

function TodayClientPage() {
  const [hiddenSections, setHiddenSections] = useState<UserSections>(["Изменения Выгоды"]);
  const { city } = useContext(UserContext);
  const {
    data: diffResponse,
    isPending,
    error
  } = useQuery({
    queryKey: ["today-diff", city],
    queryFn: () => axios.get("/api/today-diff").then(r => r.data)
  });

  if (isPending) return <PageLoader />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  const changePriceDiff: DiffsType = {};
  const changeProfitDiff: DiffsType = {};

  const diff = diffResponse as AnalysisDiff;

  /*
    Important thing: leave spaces in the beginning of titles, because they are used for sorting sections in right order.
   */
  const diffNew = {
    _id: "new-items",
    title: "   Новые поступления",
    items: diff.newItems
  };

  const diffRemoved = {
    _id: "removed-items",
    title: " Продано на сегодня",
    items: diff.removedItems
  };

  const diffChangesProfit = {
    _id: "change-profit-items",
    title: "Изменения Выгоды",
    items: diff.changesProfit.map(item => {
      changeProfitDiff[`${item.item._id}`] = item.diff;
      return item.item;
    })
  };

  const diffChangesPrice = {
    _id: "change-price-items",
    title: "  Изменения цены",
    items: diff.changesPrice.map(item => {
      changePriceDiff[`${item.item._id}`] = item.diff;
      return item.item;
    })
  };

  const digestList: PriceList = {
    _id: "digest",
    city,
    createdAt: new Date(),
    positions: [diffNew, diffChangesPrice, diffRemoved, diffChangesProfit].filter(
      Boolean
    ) as Position[]
  };

  const diffs = { ...changePriceDiff, ...changeProfitDiff };

  return (
    <>
      <PageTitle title="Обновления за день" />

      <Catalog
        hiddenSections={hiddenSections}
        onChangeHiddenSections={section =>
          setHiddenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
          )
        }
        variant="updates"
        diffs={diffs}
        priceList={digestList}
      />
      <ScrollToTop />
    </>
  );
}

export { TodayClientPage };
