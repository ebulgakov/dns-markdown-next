import { getAnalysisData } from "@/app/analysis/get-alalysis-data";
import AnalysisPageTitle from "@/app/analysis/page-title";
import { AnalyticsGoodsChart } from "@/app/components/analytics";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Title } from "@/app/components/ui/title";

export default async function AnalysisPage() {
  let city, countUniqueGoods, startFrom, currentCountGoods, goodsCountByDates, goodsChangesByDates;

  try {
    const data = await getAnalysisData();

    city = data.city;
    countUniqueGoods = data.countUniqueGoods;
    startFrom = data.startFrom;
    currentCountGoods = data.currentCountGoods;
    goodsCountByDates = data.goodsCountByDates;
    goodsChangesByDates = data.goodsChangesByDates;
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
      <AnalysisPageTitle city={city} />

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

        <Title variant="h2">Динамика количества товаров</Title>

        <AnalyticsGoodsChart chartData={goodsCountByDates} />

        <Title variant="h2">Динамика изменения состояния в каталоге</Title>

        {JSON.stringify(goodsChangesByDates, null, 2)}
      </div>
    </div>
  );
}
