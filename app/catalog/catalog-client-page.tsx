import { Catalog } from "@/app/components/catalog/catalog";
import { SortGoods } from "@/app/components/sort-goods";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate, formatTime } from "@/app/helpers/format";

import type { PriceList } from "@/types/pricelist";

type CatalogClientPageProps = {
  priceList: PriceList;
  count: number;
};

function CatalogClientPage({ priceList, count }: CatalogClientPageProps) {
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
