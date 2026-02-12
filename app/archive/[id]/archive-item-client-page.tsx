"use client";

import { useShallow } from "zustand/react/shallow";

import { Catalog } from "@/app/components/catalog";
import { JumpToSection } from "@/app/components/jump-to-section";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Search } from "@/app/components/search";
import { PageTitle } from "@/app/components/ui/page-title";
import { usePriceListStore } from "@/app/stores/pricelist-store";

import type { PriceList } from "@/types/pricelist";
import { useEffect } from "react";

type ArchiveItemClientPageProps = {
  priceList: PriceList;
};

function ArchiveItemClientPage({ priceList }: ArchiveItemClientPageProps) {
  const { updatePriceList, getPriceListCount, getPriceListCreatedDate } = usePriceListStore(
    useShallow(state => ({
      getPriceListCreatedDate: state.getPriceListCreatedDate,
      getPriceListCount: state.getPriceListCount,
      priceList: state.priceList,
      updatePriceList: state.updatePriceList
    }))
  );
  const pageTitle = `Страница Архива за ${getPriceListCreatedDate()}`;

  useEffect(() => {
    if (priceList) {
      updatePriceList(priceList);
    }
  }, [updatePriceList, priceList]);

  return (
    <div>
      <PageTitle title={pageTitle}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b data-testid="archive-price-list-count">{getPriceListCount()}</b>
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
