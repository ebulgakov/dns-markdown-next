import { getTranslations } from "next-intl/server";

import { ArchiveItemClientPage } from "@/app/archive/[id]/archive-item-client-page";

import type { Metadata } from "next";

type ArchiveItemPage = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: ArchiveItemPage): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const archiveTitle = t("archive_title");

  return { title: `${t("sub_title")}${archiveTitle}` };
}

export default async function ArchiveItemPage({ params }: ArchiveItemPage) {
  const { id } = await params;
  return <ArchiveItemClientPage id={id} />;
}
