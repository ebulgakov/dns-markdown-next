import { useTranslations } from "next-intl";

import { PageTitle } from "@/app/components/ui/page-title";

export default function AnalysisPageTitle({ city }: { city: string }) {
  const cities = useTranslations("cities");
  return <PageTitle title={`Анализ каталога в городе ${cities(city)}`} />;
}
