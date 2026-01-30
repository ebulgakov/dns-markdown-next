import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Updates } from "@/app/components/updates";
import { getLastDiffByCity } from "@/db/analysis-diff/queries";
import { getPriceListCity } from "@/db/pricelist/queries";
import { getUser } from "@/db/user/queries";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { Favorite as FavoriteType } from "@/types/user";
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
  let isUserLoggedIn;
  try {
    const { userId } = await auth();
    isUserLoggedIn = !!userId;
  } catch {
    isUserLoggedIn = false;
  }

  let diffNew;
  let diffRemoved;
  let diffChangesPrice;
  let diffChangesProfit;
  let userFavoritesGoods: FavoriteType[] = [];
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

  try {
    const user = await getUser();
    userFavoritesGoods = user.favorites;
  } catch {
    userFavoritesGoods = [];
  }

  return (
    <Updates
      diffNew={diffNew}
      isUserLoggedIn={isUserLoggedIn}
      userFavoritesGoods={userFavoritesGoods}
      diffChangesPrice={diffChangesPrice}
      changePriceDiff={changePriceDiff}
      diffRemoved={diffRemoved}
      diffChangesProfit={diffChangesProfit}
      changeProfitDiff={changeProfitDiff}
    />
  );
}
