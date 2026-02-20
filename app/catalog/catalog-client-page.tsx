"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { Catalog } from "@/app/components/catalog/catalog";
import { JumpToSection } from "@/app/components/jump-to-section/jump-to-section";
import { LLMReport } from "@/app/components/llm-report/llm-report";
import { PageLoader } from "@/app/components/page-loader/page-loader";
import { ScrollToTop } from "@/app/components/scroll-to-top/scroll-to-top";
import { Search } from "@/app/components/search/search";
import { SortGoods } from "@/app/components/sort-goods";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserContext } from "@/app/contexts/user-context";
import { usePriceListStore } from "@/app/stores/pricelist-store";
import { PriceList } from "@/types/pricelist";

type CatalogClientPageProps = {
  city?: string;
};

function CatalogClientPage({ city: cityFromUrl }: CatalogClientPageProps) {
  const { updatePriceList, priceListCreatedDate, priceListCreatedTime, priceListCount } =
    usePriceListStore(
      useShallow(state => ({
        priceListCreatedDate: state.getPriceListCreatedDate(),
        priceListCount: state.getPriceListCount(),
        priceListCreatedTime: state.getPriceListCreatedTime(),
        updatePriceList: state.updatePriceList
      }))
    );
  const { city: cityFromUser } = useContext(UserContext);
  const city = cityFromUrl || cityFromUser;
  const {
    data: priceListResponse,
    isPending,
    error
  } = useQuery({
    queryKey: ["last-price-list", city],
    queryFn: (): Promise<PriceList> =>
      axios
        .get("/api/last-pricelist", {
          params: { city }
        })
        .then(r => r.data)
  });

  useEffect(() => {
    if (priceListResponse) {
      updatePriceList(priceListResponse);
    }
  }, [priceListResponse, updatePriceList]);

  if (isPending) return <PageLoader />;
  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <>
      <PageTitle title={priceListCreatedDate} subTitle={priceListCreatedTime}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b>{priceListCount}</b>
          </div>

          <SortGoods />
        </div>
      </PageTitle>
      <Search />
      <Catalog variant="default" />
      <JumpToSection />
      <ScrollToTop variant="with-jump-to-search" />
      <LLMReport />
    </>
  );
}

export { CatalogClientPage };
