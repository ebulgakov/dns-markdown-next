import { Fragment } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Title } from "@/app/components/ui/title";
import { formatDate } from "@/app/helpers/format";

import type { Goods } from "@/types/pricelist";

type HomeUpdatesProps = {
  date?: string | Date;
  mostProfitable?: Goods;
  mostDiscounted?: Goods;
  mostCheap?: Goods;
  error?: Error;
};
export default function HomeUpdates({
  date,
  mostProfitable,
  mostDiscounted,
  mostCheap,
  error
}: HomeUpdatesProps) {
  if (error || !date || !mostProfitable || !mostDiscounted || !mostCheap) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки обновлений</AlertTitle>
        <AlertDescription>
          {error?.message || "Недостаточно данных для отображения обновлений."}
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Fragment>
      <Title variant="h2">Последние обновления на {formatDate(date)}</Title>

      <div className="flex justify-between">
        <div>
          <Title variant="h3">Самый дешёвый</Title>
          <pre>{JSON.stringify(mostCheap, null, 2)}</pre>
        </div>
        <div>
          <Title variant="h3">С наибольшей скидкой</Title>
          <pre>{JSON.stringify(mostDiscounted, null, 2)}</pre>
        </div>
        <div>
          <Title variant="h3">С наибольшей выгодой</Title>
          <pre>{JSON.stringify(mostProfitable, null, 2)}</pre>
        </div>
      </div>
    </Fragment>
  );
}
