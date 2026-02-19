"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { Catalog } from "@/app/components/catalog/catalog";
import { JumpToSection } from "@/app/components/jump-to-section/jump-to-section";
import { PageLoader } from "@/app/components/page-loader/page-loader";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Search } from "@/app/components/search";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { usePriceListStore } from "@/app/stores/pricelist-store";

import type { PriceList } from "@/types/pricelist";

type ArchiveItemClientPageProps = {
  id: string;
};

function ArchiveItemClientPage({ id }: ArchiveItemClientPageProps) {
  const t = useTranslations("metadata");
  const { updatePriceList, priceListCount, priceListCreatedDate } = usePriceListStore(
    useShallow(state => ({
      priceListCreatedDate: state.getPriceListCreatedDate(),
      priceListCount: state.getPriceListCount(),
      updatePriceList: state.updatePriceList
    }))
  );
  const {
    data: priceListResponse,
    isPending,
    error
  } = useQuery({
    queryKey: ["pricelist-by-id", id],
    queryFn: (): Promise<PriceList> =>
      axios
        .get("/api/pricelist-by-id", {
          params: { id }
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
    <div>
      <title>{`${priceListCreatedDate} | ${t("archive_title")}`}</title>
      <PageTitle title={`Страница Архива за ${priceListCreatedDate}`}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b data-testid="archive-price-list-count">{priceListCount}</b>
          </div>
        </div>
      </PageTitle>
      <Search />
      <Catalog variant="archive" />
      <JumpToSection />
      <ScrollToTop variant="with-jump-to-search" />
    </div>
  );
}

export { ArchiveItemClientPage };
