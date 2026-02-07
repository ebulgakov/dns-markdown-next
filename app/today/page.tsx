import { getTranslations } from "next-intl/server";

import { TodayClientPage } from "@/app/today/TodayClientPage";

import type { Metadata } from "next";

type UpdatesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: UpdatesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("updates_title");

  return { title: `${t("sub_title")}${title}` };
}

export default async function UpdatesPage() {
  return <TodayClientPage />;
}
