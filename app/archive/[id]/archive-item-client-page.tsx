"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { Catalog } from "@/app/components/catalog";
import { JumpToSection } from "@/app/components/jump-to-section";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Search } from "@/app/components/search";
import { PageTitle } from "@/app/components/ui/page-title";
import { usePriceListStore } from "@/app/stores/pricelist-store";

import type { PriceList } from "@/types/pricelist";

type ArchiveItemClientPageProps = {
  priceList: PriceList;
};

function ArchiveItemClientPage({ priceList }: ArchiveItemClientPageProps) {
  const { updatePriceList, priceListCount, priceListCreatedDate } = usePriceListStore(
    useShallow(state => ({
      priceListCreatedDate: state.getPriceListCreatedDate(),
      priceListCount: state.getPriceListCount(),
      priceList: state.priceList,
      updatePriceList: state.updatePriceList
    }))
  );

  useEffect(() => {
    if (priceList) {
      updatePriceList(priceList);
    }
  }, [updatePriceList, priceList]);

  return (
    <div>
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
