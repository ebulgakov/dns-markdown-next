import { getTranslations } from "next-intl/server";

import { getPriceListById } from "@/api/get";
import { PriceListPage } from "@/app/components/price-list";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate } from "@/app/helpers/format";

import type { Metadata } from "next";

type ArchiveItemPage = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: ArchiveItemPage): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  let title = "";
  try {
    const priceList = await getPriceListById(id);
    const archiveTitle = t("archive_title");
    title = `${archiveTitle} - ${formatDate(priceList.createdAt)}`;
  } catch {
    title = t("archive_not_found_title");
  }

  return { title: `${t("sub_title")}${title}` };
}

export default async function ArchiveItemPage({ params }: ArchiveItemPage) {
  const { id } = await params;
  let priceList;

  try {
    priceList = await getPriceListById(id);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки архива</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  const pageTitle = `Страница Архива за ${formatDate(priceList.createdAt)}`;
  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <div>
      <PageTitle title={pageTitle}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b>{count}</b>
          </div>
        </div>
      </PageTitle>
      <PriceListPage priceList={priceList} />
    </div>
  );
}
