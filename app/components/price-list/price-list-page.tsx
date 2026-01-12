"use client";

import clsx from "clsx";

import { SearchInput } from "@/app/components/search-input";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { useSearchStore } from "@/app/stores/search-store";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import { PriceList } from "./price-list";
import { PriceListFavoritesSection } from "./price-list-favorites-section";
import { PriceListGoods } from "./price-list-goods";

import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";

type PriceListPageProps = {
  favoriteSections?: PositionType[];
  userFavoritesGoods?: FavoriteType[];
  hiddenSectionsTitles?: UserSectionsType;
  nonFavoriteSections?: PositionType[];
  priceList: PriceListType;
  isUserLoggedIn?: boolean;
};

function PriceListPage({
  favoriteSections,
  userFavoritesGoods,
  hiddenSectionsTitles,
  nonFavoriteSections,
  isUserLoggedIn,
  priceList
}: PriceListPageProps) {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm, 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList);
  const isHiddenDefaultList = debouncedSearch.length > 1 || sortGoods !== "default";
  const priceListPositions =
    nonFavoriteSections && nonFavoriteSections.length > 0
      ? nonFavoriteSections
      : priceList.positions;

  return (
    <>
      {filteredList.map(item => (
        <PriceListGoods key={item._id} item={item} favorites={userFavoritesGoods} />
      ))}

      <div className={clsx({ hidden: isHiddenDefaultList })}>
        {isUserLoggedIn && favoriteSections && (
          <PriceListFavoritesSection
            favoriteSections={favoriteSections}
            hiddenSectionsTitles={hiddenSectionsTitles}
            userFavoritesGoods={userFavoritesGoods}
            isUserLoggedIn={isUserLoggedIn}
          />
        )}

        <PriceList
          positions={priceListPositions}
          favorites={userFavoritesGoods}
          hiddenSections={hiddenSectionsTitles}
          isUserLoggedIn={isUserLoggedIn}
        />
      </div>

      <SearchInput />
    </>
  );
}

export { PriceListPage };
