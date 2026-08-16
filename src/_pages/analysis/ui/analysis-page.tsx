import { formatDate } from "@/shared/lib";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { Title } from "@/shared/ui/title";

import { getAnalysisData } from "../api/get-analysis-data";

import { AnalysisPageTitle } from "./analysis-page-title";
import { AnalyticsGoodsChangesChart } from "./analytics-goods-changes-chart";
import { AnalyticsGoodsCountChart } from "./analytics-goods-count-chart";
import { AnalyticsReports } from "./analytics-reports";

async function AnalysisPage() {
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
    goodsChangesByDates = data.goodsChangesByDates;
  } catch (e) {
    const { message } = e as Error;
    return <ErrorAlert title="Ошибка загрузки аналитики" message={message} />;
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

        <Title variant="h2">Динамика количества товаров</Title>
        <AnalyticsGoodsCountChart chartData={goodsCountByDates} />

        <Title variant="h2">Динамика изменения состояния в каталоге</Title>
        <AnalyticsGoodsChangesChart chartData={goodsChangesByDates} />

        <Title variant="h2">Отчёт по каталогу</Title>
        <AnalyticsReports reports={reports} />
      </div>
    </div>
  );
}

export { AnalysisPage };
