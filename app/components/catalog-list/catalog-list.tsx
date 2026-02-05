import { PriceListPage } from "@/app/components/price-list";
import { SortGoods } from "@/app/components/sort-goods";
import { PageTitle } from "@/app/components/ui/page-title";
import { formatDate, formatTime } from "@/app/helpers/format";
import { PriceList } from "@/types/pricelist";
import { Favorite, UserSections } from "@/types/user";

type CatalogListProps = {
  priceList: PriceList;
  userFavorites?: Favorite[];
  hiddenSections?: UserSections;
  favoriteSections?: UserSections;
  isUserLoggedIn?: boolean;
};

function CatalogList({
  priceList,
  hiddenSections,
  favoriteSections,
  isUserLoggedIn,
  userFavorites
}: CatalogListProps) {
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
        hiddenSections={hiddenSections}
        userFavorites={userFavorites}
        priceList={priceList}
        isUserLoggedIn={isUserLoggedIn}
      />
    </div>
  );
}

export { CatalogList };
