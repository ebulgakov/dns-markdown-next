"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

import { Catalog } from "@/app/components/catalog";
import { JumpToSection } from "@/app/components/jump-to-section";
import { PageLoader } from "@/app/components/page-loader";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Search } from "@/app/components/search";
import { SortGoods } from "@/app/components/sort-goods";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserContext } from "@/app/contexts/user-context";
import { formatDate, formatTime } from "@/app/helpers/format";

import type { PriceList } from "@/types/pricelist";

function CatalogClientPage() {
  const { city } = useContext(UserContext);
  const {
    data: priceListResponse,
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

  if (isPending) return <PageLoader />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  const priceList = priceListResponse as PriceList;

  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);
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
      <Search />
      <Catalog variant="default" priceList={priceList} />
      <JumpToSection priceList={priceList} />
      <ScrollToTop variant="with-jump-to-search" />
    </>
  );
}

export { CatalogClientPage };
