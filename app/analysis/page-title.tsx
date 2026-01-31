"use client";
import { useTranslations } from "next-intl";

import { PageTitle } from "@/app/components/ui/page-title";

export default function AnalysisPageTitle({ city }: { city: string }) {
  const cities = useTranslations("cities");
  return <PageTitle title={`Анализ каталога за последние 30 дней в городе ${cities(city)}`} />;
}
