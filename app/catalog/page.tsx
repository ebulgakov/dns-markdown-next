import { getTranslations } from "next-intl/server";

import { CatalogClientPage } from "@/app/catalog/catalog-client-page";

import type { Metadata } from "next";

type CatalogPage = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CatalogPage): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("catalog_title");

  return { title: `${t("sub_title")}${title}` };
}

export default async function CatalogPage({ searchParams }: CatalogPage) {
  const params = await searchParams;
  const city = Array.isArray(params.city) ? params.city[0] : params.city;

  return <CatalogClientPage city={city} />;
}
