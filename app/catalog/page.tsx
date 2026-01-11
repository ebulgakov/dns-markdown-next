import { getCatalogData } from "@/app/catalog/get-catalog-data";
import { PriceListPage } from "@/app/components/price-list";
import { SortGoods } from "@/app/components/sort-goods";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate, formatTime } from "@/app/helpers/format";

export default async function CatalogPage() {
  const {
    priceList,
    userFavoritesGoods,
    hiddenSectionsTitles,
    favoriteSections,
    nonFavoriteSections,
    error
  } = await getCatalogData();

  if (error || !priceList) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Ошибка загрузки каталога</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  }

  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <div>
      <PageTitle title={formatDate(priceList.createdAt)} subTitle={formatTime(priceList.createdAt)}>
        <div className="mt-4 flex items-center justify-between gap-4 md:mt-0">
          <div>
            Количество: <b>{count}</b>
          </div>

          <SortGoods />
        </div>
      </PageTitle>

      <PriceListPage
        favoriteSections={favoriteSections}
        userFavoritesGoods={userFavoritesGoods}
        hiddenSectionsTitles={hiddenSectionsTitles}
        nonFavoriteSections={nonFavoriteSections}
        priceList={priceList}
      />
    </div>
  );
}
