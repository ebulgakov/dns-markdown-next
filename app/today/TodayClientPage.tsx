import { Catalog } from "@/app/components/catalog/catalog";
import { PageTitle } from "@/app/components/ui/page-title";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { PriceList } from "@/types/pricelist";

type TodayClientPageProps = {
  priceList: PriceList;
  diffs: DiffsType;
};
function TodayClientPage({ priceList, diffs }: TodayClientPageProps) {
  return (
    <>
      <PageTitle title="Обновления за день" />

      <Catalog
        customSortSections={[
          "Новые поступления",
          "Изменения цены",
          "Продано на сегодня",
          "Изменения Выгоды"
        ]}
        customHiddenSections={["Изменения Выгоды"]}
        variant="updates"
        diffs={diffs}
        priceList={priceList}
      />
    </>
  );
}

export { TodayClientPage };
