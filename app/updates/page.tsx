import { auth } from "@clerk/nextjs/server";

import { PriceListSection } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { getPriceListCity, getPriceListsDiff } from "@/db/pricelist/queries";
import { getUser } from "@/db/user/queries";

import type { DiffsCollection as DiffsCollectionType } from "@/types/diff";
import type { Favorite as FavoriteType } from "@/types/user";

export default async function UpdatesPage() {
  const { userId } = await auth();

  let diffNew;
  let diffRemoved;
  let diffChangesPrice;
  let diffChangesProfit;
  let userFavoritesGoods: FavoriteType[] = [];
  const changePriceDiff: DiffsCollectionType = {};
  const changeProfitDiff: DiffsCollectionType = {};

  try {
    const city = await getPriceListCity();
    const collection = await getPriceListsDiff(city);
    const collectionDiff = collection?.diff;
    const collectionSold = collection?.sold;
    const collectionNew = collection?.new;

    if (collectionNew && collectionNew.goods.length > 0) {
      diffNew = {
        _id: "new-items",
        title: "Новые поступления",
        items: collectionNew.goods
      };
    }

    if (collectionDiff && collectionDiff.changesProfit.length > 0) {
      diffChangesProfit = {
        _id: "change-profit-items",
        title: "Изменения Выгоды",
        items: collectionDiff.changesProfit?.map(item => {
          changeProfitDiff[`${item.item._id}`] = item.diff;
          return item.item;
        })
      };
    }

    if (collectionDiff && collectionDiff.changesPrice.length > 0) {
      diffChangesPrice = {
        _id: "change-price-items",
        title: "Изменения цены",
        items: collectionDiff.changesPrice?.map(item => {
          changePriceDiff[`${item.item._id}`] = item.diff;
          return item.item;
        })
      };
    }

    if (collectionSold && collectionSold.goods.length > 0) {
      diffRemoved = {
        _id: "removed-items",
        title: "Продано на сегодня",
        items: collectionSold.goods
      };
    }
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
    <div>
      <PageTitle title="Обновления с начала дня" />
      {diffNew && (
        <PriceListSection
          isUserLoggedIn={!!userId}
          isOpen={true}
          position={diffNew}
          favorites={userFavoritesGoods}
        />
      )}
      {diffChangesPrice && (
        <PriceListSection
          isUserLoggedIn={!!userId}
          isOpen={true}
          position={diffChangesPrice}
          favorites={userFavoritesGoods}
          diffs={changePriceDiff}
        />
      )}
      {diffRemoved && <PriceListSection isOpen={true} position={diffRemoved} />}
      {diffChangesProfit && (
        <PriceListSection
          isUserLoggedIn={!!userId}
          position={diffChangesProfit}
          diffs={changeProfitDiff}
          favorites={userFavoritesGoods}
        />
      )}
    </div>
  );
}
