import { getTranslations } from "next-intl/server";

import { getArchiveListDates, getPriceListCity } from "@/api";
import { ArchiveList } from "@/app/archive/ArchiveList";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";

import type { Metadata } from "next";

type ArchivePage = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ArchivePage): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("archive_title");

  return { title: `${t("sub_title")}${title}` };
}
export default async function ArchivePage() {
  let archiveCollection;

  try {
    const city = await getPriceListCity();
    archiveCollection = await getArchiveListDates(city);
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки архива прайслистов</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <PageTitle title="Архив прайслистов" />
      <ArchiveList archiveCollection={archiveCollection} />
    </div>
  );
}
