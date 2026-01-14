import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";

import { getCatalogData } from "@/app/catalog/get-catalog-data";
import { PriceListPage } from "@/app/components/price-list";
import { SortGoods } from "@/app/components/sort-goods";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate, formatTime } from "@/app/helpers/format";

import type { Metadata } from "next";

type CatalogPage = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CatalogPage): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const catalogTitle = t("catalog_title");

  return { title: `${t("sub_title")}${catalogTitle}` };
}

export default async function CatalogPage() {
  const { userId } = await auth();
  const {
    priceList,
    userFavoritesGoods,
    hiddenSectionsTitles,
    favoriteSections,
    nonFavoriteSections,
    error
  } = await getCatalogData();

  if (error || !priceList) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }

  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <div>
      <PageTitle title={formatDate(priceList.createdAt)} subTitle={formatTime(priceList.createdAt)}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b>{count}</b>
          </div>

          <SortGoods />
        </div>
      </PageTitle>

      <PriceListPage
        favoriteSections={favoriteSections}
        userFavoritesGoods={userFavoritesGoods}
        hiddenSectionsTitles={hiddenSectionsTitles}
        nonFavoriteSections={nonFavoriteSections}
        priceList={priceList}
        isUserLoggedIn={!!userId}
      />
    </div>
  );
}
