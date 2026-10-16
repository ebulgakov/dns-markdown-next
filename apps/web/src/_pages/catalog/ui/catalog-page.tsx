import { getTranslations } from "next-intl/server";

import { CatalogClientPage } from "./catalog-client-page";

import type { Metadata } from "next";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("catalog_title");

  return { title: `${t("sub_title")}${title}` };
}

async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const city = Array.isArray(params.city) ? params.city[0] : params.city;

  return <CatalogClientPage city={city} />;
}

export { CatalogPage };
