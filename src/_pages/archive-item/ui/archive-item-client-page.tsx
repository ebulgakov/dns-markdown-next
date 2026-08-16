"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePriceListStore } from "@/entities/product";
import { JumpToSection } from "@/features/jump-to-section";
import { Catalog } from "@/features/product-catalog";
import { Search } from "@/features/search";
import { ErrorAlert } from "@/shared/ui/error-alert";
import { PageLoader } from "@/shared/ui/page-loader";
import { PageTitle } from "@/shared/ui/page-title";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";

import type { PriceList } from "@/entities/product";

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
  if (error) return <ErrorAlert title="Ошибка загрузки каталога" message={error.message} />;

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
