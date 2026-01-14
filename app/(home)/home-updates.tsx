import { Fragment } from "react";

import { HotOffer } from "@/app/components/hot-offer";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Title } from "@/app/components/ui/title";
import { formatDate } from "@/app/helpers/format";

import type { CustomDate } from "@/types/common";
import type { Goods } from "@/types/pricelist";

type HomeUpdatesProps = {
  date?: CustomDate;
  mostProfitable?: Goods;
  mostDiscounted?: Goods;
  mostCheap?: Goods;
  error?: Error;
};

function EmptyOffer() {
  return <>-</>;
}

export default function HomeUpdates({
  date,
  mostProfitable,
  mostDiscounted,
  mostCheap,
  error
}: HomeUpdatesProps) {
  if (error || !date) {
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

      <div className="grid gap-x-8 gap-y-2 md:grid-cols-[repeat(2,_1fr)] lg:grid-cols-[repeat(3,_1fr)]">
        <div>
          <Title variant="h3">Самый дешёвый</Title>
          {mostCheap ? <HotOffer goods={mostCheap} /> : <EmptyOffer />}
        </div>
        <div>
          <Title variant="h3">С наибольшей скидкой</Title>
          {mostDiscounted ? <HotOffer goods={mostDiscounted} /> : <EmptyOffer />}
        </div>
        <div>
          <Title variant="h3">С наибольшей выгодой</Title>
          {mostProfitable ? <HotOffer goods={mostProfitable} /> : <EmptyOffer />}
        </div>
      </div>
    </Fragment>
  );
}
