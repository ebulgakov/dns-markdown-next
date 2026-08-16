import { getTranslations } from "next-intl/server";

import { getArchiveListDates } from "@/entities/product";
import { getPriceListCity } from "@/entities/user";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PageTitle } from "@/shared/ui/page-title";

import { ArchiveList } from "./archive-list";

import type { Metadata } from "next";

type ArchivePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("archive_title");

  return { title: `${t("sub_title")}${title}` };
}

async function ArchivePage() {
  let archiveCollection;

  try {
    const city = await getPriceListCity();
    archiveCollection = await getArchiveListDates(city);
  } catch (e) {
    const { message } = e as Error;
    return <ErrorAlert title="Ошибка загрузки архива прайслистов" message={message} />;
  }

  return (
    <div>
      <PageTitle title="Архив прайслистов" />
      <ArchiveList archiveCollection={archiveCollection} />
    </div>
  );
}

export { ArchivePage };
