import { getTranslations } from "next-intl/server";

import { getPriceListCity, getLastDiffByCity } from "@/api/get";
import { PriceListPage } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { Position, PriceList } from "@/types/pricelist";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Metadata } from "next";

type UpdatesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: UpdatesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("updates_title");

  return { title: `${t("sub_title")}${title}` };
}

export default async function UpdatesPage() {
  let diffNew;
  let diffRemoved;
  let diffChangesPrice;
  let diffChangesProfit;
  const changePriceDiff: DiffsType = {};
  const changeProfitDiff: DiffsType = {};

  let city;

  try {
    city = await getPriceListCity();
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки города</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  try {
    const collection = await getLastDiffByCity(city);

    diffNew = {
      _id: "new-items",
      title: "Новые поступления",
      items: collection.newItems
    };

    diffRemoved = {
      _id: "removed-items",
      title: "Продано на сегодня",
      items: collection.removedItems
    };

    diffChangesProfit = {
      _id: "change-profit-items",
      title: "Изменения Выгоды",
      items: collection.changesProfit.map(item => {
        changeProfitDiff[`${item.item._id}`] = item.diff;
        return item.item;
      })
    };

    diffChangesPrice = {
      _id: "change-price-items",
      title: "Изменения цены",
      items: collection.changesPrice.map(item => {
        changePriceDiff[`${item.item._id}`] = item.diff;
        return item.item;
      })
    };
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки обновлений</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

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

      <PriceListPage variant="updates" diffs={diffs} priceList={digestList} />
    </>
  );
}
