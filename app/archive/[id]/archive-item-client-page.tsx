"use client";

import { useContext } from "react";

import { Catalog } from "@/app/components/catalog";
import { JumpToSection } from "@/app/components/jump-to-section";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Search } from "@/app/components/search";
import { PageTitle } from "@/app/components/ui/page-title";
import { UserContext } from "@/app/contexts/user-context";
import { formatDate } from "@/app/helpers/format";

import type { PriceList } from "@/types/pricelist";

type ArchiveItemClientPageProps = {
  priceList: PriceList;
  count: number;
};

function ArchiveItemClientPage({ priceList, count }: ArchiveItemClientPageProps) {
  const { hiddenSections } = useContext(UserContext);
  const pageTitle = `Страница Архива за ${formatDate(priceList.createdAt)}`;

  return (
    <div>
      <PageTitle title={pageTitle}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b data-testid="archive-price-list-count">{count}</b>
          </div>
        </div>
      </PageTitle>
      <Search />
      <Catalog hiddenSections={hiddenSections} variant="archive" priceList={priceList} />
      <JumpToSection priceList={priceList} />
      <ScrollToTop variant="with-jump-to-search" />
    </div>
  );
}

export { ArchiveItemClientPage };
