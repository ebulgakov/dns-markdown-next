import ErrorMessage from "@/app/components/ErrorMessage";
import PriceList from "@/app/components/PriceList/PriceList";
import { getCatalogData } from "@/app/catalog/getCatalogData";

const dateFormat = new Intl.DateTimeFormat("ru", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

const timeFormat = new Intl.DateTimeFormat("ru", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
});

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
      <div className="flex justify-between items-end border-b border-solid border-b-neutral-300  mt-10 mb-5 mx-0 pb-5">
        <h1 className="text-4xl">
          {dateFormat.format(date)}{" "}
          <small className="font-normal leading-none text-[#777777] text-[65%]">
            {timeFormat.format(date)}
          </small>
        </h1>
        <div>
          Количество: <b>{count}</b>
        </div>
      </div>

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
