import { Catalog } from "@/app/components/catalog";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate } from "@/app/helpers/format";

import type { PriceList } from "@/types/pricelist";

type ArchiveItemClientPageProps = {
  priceList: PriceList;
  count: number;
};

function ArchiveItemClientPage({ priceList, count }: ArchiveItemClientPageProps) {
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
      <Catalog variant="archive" priceList={priceList} />
    </div>
  );
}

export { ArchiveItemClientPage };
