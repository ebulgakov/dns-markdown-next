import ErrorMessage from "@/app/components/ErrorMessage";
import PriceList from "@/app/components/PriceList/PriceList";
import { getCatalogData } from "@/app/catalog/getCatalogData";
import { formatDate, formatTime } from "@/app/helpers/format";
import PageTitle from "@/app/components/PageTitle";

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
    return <ErrorMessage>{error?.message}</ErrorMessage>;
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

      {favoriteSections.length > 0 ? (
        <>
          <h2 className="text-3xl mb-5">Избранные категории</h2>
          <PriceList
            positions={favoriteSections}
            favorites={userFavoritesGoods}
            hiddenSections={hiddenSectionsTitles}
          />
          <h2 className="text-3xl mb-5 mt-10">Все категории</h2>
        </>
      ) : (
        <div className="border border-green-800 bg-green-50 text-green-800 rounded-lg p-4 mb-10">
          Добавьте избранные категории в вашем профиле и они всегда будут закреплены вверху списка
        </div>
      )}

      <PriceList
        positions={nonFavoriteSections.length > 0 ? nonFavoriteSections : priceList.positions}
        favorites={userFavoritesGoods}
        hiddenSections={hiddenSectionsTitles}
      />
    </div>
  );
}
