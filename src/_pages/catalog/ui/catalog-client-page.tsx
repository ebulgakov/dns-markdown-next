"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePriceListStore } from "@/entities/product";
import { PriceList } from "@/entities/product";
import { UserContext } from "@/entities/user";
import { JumpToSection } from "@/features/jump-to-section";
import { LLMReport } from "@/features/llm-report";
import { Catalog } from "@/features/product-catalog";
import { Search } from "@/features/search";
import { SortGoods } from "@/features/sort-goods";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PageLoader } from "@/shared/ui/page-loader";
import { PageTitle } from "@/shared/ui/page-title";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";

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
  if (error) return <ErrorAlert title="Ошибка загрузки каталога" message={error.message} />;

  return (
    <>
      <PageTitle title={priceListCreatedDate} subTitle={priceListCreatedTime}>
        <div className="relative z-10 mt-4 flex items-center justify-between gap-4 md:mt-0">
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
