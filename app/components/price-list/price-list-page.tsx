"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { Fragment } from "react";

import { Filter } from "@/app/components/filter";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Title } from "@/app/components/ui/title";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { useSearchStore } from "@/app/stores/search-store";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import { PriceList } from "./price-list";
import { PriceListFavoritesEmptyAlert } from "./price-list-favorites-empty-alert";
import { PriceListGoods } from "./price-list-goods";

import type { Position, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite, UserSections } from "@/types/user";

type PriceListPageProps = {
  favoriteSections?: UserSections;
  hiddenSections?: UserSections;
  userFavorites?: Favorite[];
  priceList: PriceListType;
};

function PriceListPage({
  favoriteSections = [],
  hiddenSections = [],
  userFavorites,
  priceList
}: PriceListPageProps) {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
  const onChangeSearch = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList);
  const isHiddenDefaultList = debouncedSearch.length > 1 || sortGoods !== "default";

  const favoriteSectionsPositions: Position[] = [];
  const nonFavoritesSectionsPositions: Position[] = [];

  priceList.positions.forEach(section => {
    if (favoriteSections?.includes(section.title)) {
      favoriteSectionsPositions.push(section);
    } else {
      nonFavoritesSectionsPositions.push(section);
    }
  });

  return (
    <div data-testid="price-list-page">
      {debouncedSearch.length > 1 && (
        <>
          <div className="mb-4">
            <Title variant="h2">
              Поиск по названию товара:&nbsp;
              <span className="font-normal">{searchTerm.trim()}</span>&nbsp;
              <button
                className="text-destructive relative top-2 ml-1 cursor-pointer p-1 md:top-1"
                onClick={() => onChangeSearch("")}
              >
                <span className="sr-only">Очистить поиск</span>
                <X />
              </button>
            </Title>
            <div>
              Найдено товаров: <b>{filteredList.length}</b>
            </div>
          </div>
          <div className="divide-y divide-neutral-300">
            {filteredList.map(item => (
              <PriceListGoods key={item._id} item={item} favorites={userFavorites} />
            ))}
          </div>
        </>
      )}

      <div className={clsx({ hidden: isHiddenDefaultList })}>
        {favoriteSections.length > 0 ? (
          <Fragment>
            <Title variant="h2">Избранные категории</Title>

            <PriceList
              positions={favoriteSectionsPositions.sort((a, b) => a.title.localeCompare(b.title))}
              favorites={userFavorites}
              hiddenSections={hiddenSections}
              favoriteSections={favoriteSections}
            />

            <Title variant="h2">Все категории</Title>
          </Fragment>
        ) : (
          <PriceListFavoritesEmptyAlert />
        )}

        <PriceList
          positions={nonFavoritesSectionsPositions.sort((a, b) => a.title.localeCompare(b.title))}
          favorites={userFavorites}
          hiddenSections={hiddenSections}
          favoriteSections={favoriteSections}
        />
      </div>

      <ScrollToTop variant="filter" />
      <Filter
        priceList={priceList}
        hiddenSections={hiddenSections}
        foundCount={filteredList.length}
      />
    </div>
  );
}

export { PriceListPage };
