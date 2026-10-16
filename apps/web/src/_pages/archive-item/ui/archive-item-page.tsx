import { getTranslations } from "next-intl/server";

import { ArchiveItemClientPage } from "./archive-item-client-page";

import type { Metadata } from "next";

type ArchiveItemPageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: ArchiveItemPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const archiveTitle = t("archive_title");

  return { title: `${t("sub_title")}${archiveTitle}` };
}

async function ArchiveItemPage({ params }: ArchiveItemPageProps) {
  const { id } = await params;
  return <ArchiveItemClientPage id={id} />;
}

export { ArchiveItemPage };
