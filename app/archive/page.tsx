import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate } from "@/app/helpers/format";
import { getArchiveList, getPriceListCity } from "@/db/pricelist/queries";

import type { Metadata } from "next";

type ArchivePage = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ArchivePage): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const archiveTitle = t("archive_title");

  return { title: `${t("sub_title")}${archiveTitle}` };
}
export default async function ArchivePage() {
  let archiveCollection;

  try {
    const city = await getPriceListCity();
    archiveCollection = await getArchiveList(city);
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
      <ul className="space-y-1">
        {archiveCollection.map(item => (
          <li key={item._id}>
            <Link href={`/archive/${item._id}`}>
              <span className="text-blue-500 hover:underline">{formatDate(item.createdAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
