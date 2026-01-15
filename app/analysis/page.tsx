import { getAnalysisData } from "@/app/analysis/get-alalysis-data";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate } from "@/app/helpers/format";

export default async function AnalysisPage() {
  let city;
  let countUniqueGoods;
  let archiveCollection;
  let startFrom;
  let currentCountGoods;

  try {
    const data = await getAnalysisData();

    city = data.city;
    countUniqueGoods = data.countUniqueGoods;
    archiveCollection = data.archiveCollection;
    startFrom = formatDate(archiveCollection[0].createdAt);

    console.log(archiveCollection);
    // currentCountGoods = archiveCollection[archiveCollection.length - 1].positions.reduce(
    //   (acc, cur) => acc + cur.items.length,
    //   0
    // );
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
          C этого времени в каталог было добавлено товаров: <b>{currentCountGoods}</b>
        </p>
      </div>
    </div>
  );
}
