import { getTranslations } from "next-intl/server";

import { getPriceListCity, getLastDiffByCity } from "@/api/get";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Updates } from "@/app/components/updates";

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

  try {
    const city = await getPriceListCity();
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

  return (
    <Updates
      diffNew={diffNew}
      diffChangesPrice={diffChangesPrice}
      changePriceDiff={changePriceDiff}
      diffRemoved={diffRemoved}
      diffChangesProfit={diffChangesProfit}
      changeProfitDiff={changeProfitDiff}
    />
  );
}
