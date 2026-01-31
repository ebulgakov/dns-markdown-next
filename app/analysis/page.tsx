import { getAnalysisData } from "@/app/analysis/get-analysis-data";
import AnalysisPageTitle from "@/app/analysis/page-title";
import {
  AnalyticsGoodsCountChart,
  AnalyticsGoodsChangesChart,
  AnalyticsReports
} from "@/app/components/analytics";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Title } from "@/app/components/ui/title";
import { formatDate } from "@/app/helpers/format";

export default async function AnalysisPage() {
  let city,
    countUniqueGoods,
    startFrom,
    currentCountGoods,
    goodsCountByDates,
    goodsChangesByDates,
    reports;

  try {
    const data = await getAnalysisData();

    city = data.city;
    goodsCountByDates = data.goodsCountByDates;
    countUniqueGoods = data.countUniqueGoods;
    startFrom = data.startFrom;
    currentCountGoods = goodsCountByDates[goodsCountByDates.length - 1].count;
    reports = data.reports;

    // Hide the first entry as it represents the initial state with new goods only
    data.goodsChangesByDates.shift();
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
          Аналитика ведётся с даты: <b>{formatDate(startFrom)}</b>
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

        <Title variant="h2">Отчёт по каталогу</Title>
        <AnalyticsReports reports={reports} />

        <Title variant="h2">Динамика количества товаров</Title>
        <AnalyticsGoodsCountChart chartData={goodsCountByDates} />

        <Title variant="h2">Динамика изменения состояния в каталоге</Title>
        <AnalyticsGoodsChangesChart chartData={goodsChangesByDates} />
      </div>
    </div>
  );
}
