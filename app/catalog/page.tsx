import { getCatalogData } from "@/app/catalog/getCatalogData";
import { formatDate, formatTime } from "@/app/helpers/format";
import PageTitle from "@/app/components/PageTitle";
import PriceListPage from "@/app/components/PriceList/PriceListPage";
import Alert from "@/app/components/Alert";

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
    return <Alert variant="error">{error?.message}</Alert>;
  }

  const date = new Date(priceList.createdAt);
  const count = priceList.positions.reduce((acc, cur) => acc + cur.items.length, 0);

  return (
    <div>
      <PageTitle title={formatDate(date)} subTitle={formatTime(date)}>
        <div>
          Количество: <b>{count}</b>
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
