"use client";

import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { X } from "lucide-react";
import { Fragment, useContext } from "react";

import { Filter } from "@/app/components/filter";
import { PriceListSection } from "@/app/components/price-list/price-list-section";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Title } from "@/app/components/ui/title";
import { UserContext } from "@/app/contexts/user-context";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { useSearchStore } from "@/app/stores/search-store";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import { PriceListFavoritesEmptyAlert } from "./price-list-favorites-empty-alert";
import { PriceListGoods } from "./price-list-goods";

import type { Position, PriceList as PriceListType } from "@/types/pricelist";

type PriceListPageProps = {
  variant?: "archive";
  priceList: PriceListType;
};

function PriceListPage({ priceList, variant }: PriceListPageProps) {
  const { favoriteSections } = useContext(UserContext);
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
  const onChangeSearch = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList);
  const isHiddenDefaultList = debouncedSearch.length > 2 || sortGoods !== "default";

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
      {debouncedSearch.length > 2 && (
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
              <PriceListGoods shownFavorites={variant !== "archive"} key={item._id} item={item} />
            ))}
          </div>
        </>
      )}

      <div className={clsx({ hidden: isHiddenDefaultList })}>
        {favoriteSections.length > 0 ? (
          <Fragment>
            <Title variant="h2">Избранные категории</Title>

            {favoriteSectionsPositions
              .sort((a, b) => a.title.localeCompare(b.title))
              .map(position => (
                <PriceListSection
                  shownAddingToFavorites={variant !== "archive"}
                  shownHeart
                  key={position._id}
                  position={position}
                />
              ))}

            <Title variant="h2">Все категории</Title>
          </Fragment>
        ) : (
          <PriceListFavoritesEmptyAlert />
        )}

        {nonFavoritesSectionsPositions
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(position => (
            <PriceListSection
              shownAddingToFavorites={variant !== "archive"}
              shownHeart
              key={position._id}
              position={position}
            />
          ))}
      </div>

      <ScrollToTop variant="filter" />
      <Filter priceList={priceList} foundCount={filteredList.length} />
    </div>
  );
}

export { PriceListPage };
