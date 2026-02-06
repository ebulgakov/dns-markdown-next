import { getTranslations } from "next-intl/server";

import { getLastPriceList, getPriceListCity } from "@/api/get";
import { getUser as getGenericUser } from "@/api/post";
import { PriceListPage } from "@/app/components/price-list";
import { SortGoods } from "@/app/components/sort-goods";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate, formatTime } from "@/app/helpers/format";
import { User } from "@/types/user";

import type { PriceList } from "@/types/pricelist";
import type { Metadata } from "next";

type CatalogPage = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CatalogPage): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("catalog_title");

  return { title: `${t("sub_title")}${title}` };
}

export default async function CatalogPage() {
  let genericUser: User | null = null;

  try {
    genericUser = await getGenericUser();
  } catch (error) {
    const e = error as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки пользователя</AlertTitle>
        <AlertDescription>{e.message}</AlertDescription>
      </Alert>
    );
  }

  let priceList: PriceList | null = null;
  try {
    const city = await getPriceListCity();
    priceList = await getLastPriceList(city);
    if (!priceList) throw new Error("Price list not found");
  } catch (error) {
    const e = error as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{e.message}</AlertDescription>
      </Alert>
    );
  }

  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <>
      <PageTitle title={formatDate(priceList.createdAt)} subTitle={formatTime(priceList.createdAt)}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b>{count}</b>
          </div>

          <SortGoods />
        </div>
      </PageTitle>

      <PriceListPage
        favoriteSections={genericUser?.favoriteSections}
        hiddenSections={genericUser?.hiddenSections}
        userFavorites={genericUser?.favorites}
        priceList={priceList}
      />
    </>
  );
}
