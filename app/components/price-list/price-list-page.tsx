"use client";

import clsx from "clsx";
import { Fragment } from "react";

import { SearchInput } from "@/app/components/search-input";
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
  isUserLoggedIn?: boolean;
};

function PriceListPage({
  favoriteSections = [],
  hiddenSections = [],
  userFavorites = [],
  isUserLoggedIn,
  priceList
}: PriceListPageProps) {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
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
      {filteredList.map(item => (
        <PriceListGoods key={item._id} item={item} favorites={userFavorites} />
      ))}

      <div className={clsx({ hidden: isHiddenDefaultList })}>
        {favoriteSections.length > 0 ? (
          <Fragment>
            <Title variant="h2">Избранные категории</Title>

            <PriceList
              positions={favoriteSectionsPositions}
              favorites={userFavorites}
              hiddenSections={hiddenSections}
              favoriteSections={favoriteSections}
              isUserLoggedIn={isUserLoggedIn}
            />

            <Title variant="h2">Все категории</Title>
          </Fragment>
        ) : (
          <PriceListFavoritesEmptyAlert isUserLoggedIn={isUserLoggedIn} />
        )}

        <PriceList
          positions={nonFavoritesSectionsPositions}
          favorites={userFavorites}
          hiddenSections={hiddenSections}
          favoriteSections={favoriteSections}
          isUserLoggedIn={isUserLoggedIn}
        />
      </div>

      <SearchInput />
    </div>
  );
}

export { PriceListPage };
