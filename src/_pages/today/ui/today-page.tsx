import { getTranslations } from "next-intl/server";

import { TodayClientPage } from "./today-client-page";

import type { Metadata } from "next";

type TodayPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TodayPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("updates_title");

  return { title: `${t("sub_title")}${title}` };
}

async function TodayPage() {
  return <TodayClientPage />;
}

export { TodayPage };
