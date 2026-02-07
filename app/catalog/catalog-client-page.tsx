"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

import { Catalog } from "@/app/components/catalog";
import { SortGoods } from "@/app/components/sort-goods";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserContext } from "@/app/contexts/user-context";
import { formatDate, formatTime } from "@/app/helpers/format";

import type { PriceList } from "@/types/pricelist";

function CatalogClientPage() {
  const { city } = useContext(UserContext);
  const {
    data: priceList,
    isPending,
    error
  } = useQuery({
    queryKey: ["last-price-list", city],
    queryFn: () =>
      axios
        .get("/api/last-pricelist", {
          params: { city }
        })
        .then(r => r.data)
  });

  if (isPending) return <span>Loading...</span>;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  const count = (priceList as PriceList).positions.reduce((acc, cur) => acc + cur.items.length, 0);
  return (
    <>
      <PageTitle title={formatDate(priceList.createdAt)} subTitle={formatTime(priceList.createdAt)}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b>{count}</b>
          </div>

          <SortGoods />
        </div>
      </PageTitle>

      <Catalog variant="default" priceList={priceList} />
    </>
  );
}

export { CatalogClientPage };
