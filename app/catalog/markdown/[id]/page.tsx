import { getTranslations } from "next-intl/server";

import { getProductByLink } from "@/api/get";
import { ChartPrices } from "@/app/components/chart-prices";
import { LLMReport } from "@/app/components/llm-report";
import { ProductCard } from "@/app/components/product-card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { Title } from "@/app/components/ui/title";

import type { Metadata } from "next";

type CatalogItemPage = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: CatalogItemPage): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  let title = "";
  try {
    const product = await getProductByLink(`/catalog/markdown/${id}/`);
    title = product.item.title;
  } catch {
    title = t("goods_not_found_title");
  }

  return { title: `${t("sub_title")}${title}` };
}

export default async function CatalogItemPage({ params }: CatalogItemPage) {
  const { id } = await params;
  let product;

  try {
    product = await getProductByLink(`/catalog/markdown/${id}/`);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки товара</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <PageTitle title={product.item.title} />

      <ProductCard item={product.item} shownFavorites status={product.status} />

      <Title variant="h2">Сравнение цен</Title>

      <ul className="ml-5 list-disc">
        <li>
          <a
            className="font-bold"
            rel="noopener noreferrer"
            target="_blank"
            href={`https://market.yandex.ru/search?text=${encodeURI(product.item.title)}`}
          >
            <span className="text-[#ff0400]">Я.</span>Маркет
          </a>
        </li>
        <li>
          <a
            className="font-bold text-[#f37f00]"
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.citilink.ru/search/?text=${encodeURI(product.item.title)}`}
          >
            Ситилинк
          </a>
        </li>
      </ul>

      <Title variant="h2">График цены</Title>
      <ChartPrices chartData={product.history} />
      <LLMReport />
    </div>
  );
}
