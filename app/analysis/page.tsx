import { getAnalysisData } from "@/app/analysis/get-alalysis-data";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";

export default async function AnalysisPage() {
  let city, countUniqueGoods, startFrom, currentCountGoods;

  try {
    const data = await getAnalysisData();

    city = data.city;
    countUniqueGoods = data.countUniqueGoods;
    startFrom = data.startFrom;
    currentCountGoods = data.currentCountGoods;
  } catch (e) {
    const { message } = e as Error;
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки аналитики</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <PageTitle title={`Анализ каталога в городе ${city}`} />

      <div className="mt-4 text-lg">
        <p>
          Аналитика ведётся с даты: <b>{startFrom}</b>
        </p>
        <p>
          C этого времени в каталог было добавлено товаров: <b>{countUniqueGoods}</b>
        </p>
        <p>
          Из них продано на текущий момент : <b>{countUniqueGoods - currentCountGoods}</b>
        </p>
        <p>
          В текущем прайс-листе доступно товаров: <b>{currentCountGoods}</b>
        </p>
      </div>
    </div>
  );
}
