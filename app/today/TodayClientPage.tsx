"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

import { Catalog } from "@/app/components/catalog";
import { PageLoader } from "@/app/components/page-loader";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserContext } from "@/app/contexts/user-context";
import { formatDate } from "@/app/helpers/format";
import { AnalysisDiff, DiffsCollection as DiffsType } from "@/types/analysis-diff";
import { PriceList } from "@/types/pricelist";

const transformDiffData = (diff: AnalysisDiff, city: string) => {
  const digestList: PriceList = {
    _id: "digest",
    city,
    createdAt: diff.dateAdded,
    positions: [
      {
        _id: "new-items",
        title: "Новые поступления",
        items: diff.newItems
      },
      {
        _id: "change-price-items",
        title: "Изменения цены",
        items: diff.changesPrice.map(({ item }) => item)
      },
      {
        _id: "removed-items",
        title: "Продано на сегодня",
        items: diff.removedItems
      },
      {
        _id: "change-profit-items",
        title: "Изменения Выгоды",
        items: diff.changesProfit.map(({ item }) => item)
      }
    ]
  };

  const diffs = [...diff.changesPrice, ...diff.changesProfit].reduce((acc, item) => {
    acc[`${item.item._id}`] = item.diff;
    return acc;
  }, {} as DiffsType);

  return { diffs, digestList };
};

function TodayClientPage() {
  const { city } = useContext(UserContext);
  const {
    data: diff,
    isPending,
    error
  } = useQuery({
    queryKey: ["today-diff", city],
    queryFn: (): Promise<AnalysisDiff> => axios.get("/api/today-diff").then(r => r.data)
  });

  const diffData = diff ? transformDiffData(diff, city) : null;

  if (isPending) return <PageLoader />;

  if (error || !diffData)
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );

  return (
    <>
      <PageTitle title={`Обновления на ${formatDate(diffData.digestList.createdAt)}`} />

      <Catalog variant="updates" diffs={diffData.diffs} priceList={diffData.digestList} />
      <ScrollToTop />
    </>
  );
}

export { TodayClientPage };
