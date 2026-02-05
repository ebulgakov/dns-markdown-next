import { getTranslations } from "next-intl/server";

import { getLastPriceList, getPriceListCity } from "@/api/get";
import { getUser } from "@/api/user";
import { CatalogList } from "@/app/components/catalog-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

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
  const city = await getPriceListCity();
  const user = await getUser();
  let priceList: PriceList | null = null;

  try {
    priceList = await getLastPriceList(city);
    if (!priceList) throw new Error();
  } catch (error) {
    const e = error as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{e.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <CatalogList
      favoriteSections={user?.favoriteSections}
      hiddenSections={user?.hiddenSections}
      userFavorites={user?.favorites}
      priceList={priceList}
      isUserLoggedIn={!!user}
    />
  );
}
