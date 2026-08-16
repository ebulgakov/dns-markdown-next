"use client";
import { useTranslations } from "next-intl";

import { PageTitle } from "@/shared/ui/page-title";

function AnalysisPageTitle({ city }: { city: string }) {
  const cities = useTranslations("cities");
  return <PageTitle title={`Анализ каталога за последние 30 дней в городе ${cities(city)}`} />;
}

export { AnalysisPageTitle };
