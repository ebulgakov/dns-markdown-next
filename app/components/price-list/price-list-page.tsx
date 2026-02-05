"use client";

import clsx from "clsx";
import { Fragment } from "react";

import { SearchInput } from "@/app/components/search-input";
import { Title } from "@/app/components/ui/title";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { useGuestData } from "@/app/hooks/use-guest-data";
import { useSearchStore } from "@/app/stores/search-store";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

import { PriceList } from "./price-list";
import { PriceListFavoritesEmptyAlert } from "./price-list-favorites-empty-alert";
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
  const { getGuestData } = useGuestData();
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList);
  const isHiddenDefaultList = debouncedSearch.length > 1 || sortGoods !== "default";
  const priceListPositions =
    nonFavoriteSections && nonFavoriteSections.length > 0
      ? nonFavoriteSections
      : priceList.positions;

  const favoriteSectionsTitles: UserSectionsType = favoriteSections
    ? favoriteSections.map(section => section.title)
    : [];

  console.log(getGuestData());

  return (
    <div data-testid="price-list-page">
      {filteredList.map(item => (
        <PriceListGoods key={item._id} item={item} favorites={userFavoritesGoods} />
      ))}

      <div className={clsx({ hidden: isHiddenDefaultList })}>
        {favoriteSections && (
          <Fragment>
            {isUserLoggedIn && favoriteSections.length > 0 ? (
              <Fragment>
                <Title variant="h2">Избранные категории</Title>

                <PriceList
                  positions={favoriteSections}
                  favorites={userFavoritesGoods}
                  hiddenSections={hiddenSectionsTitles}
                  favoriteSections={favoriteSectionsTitles}
                  isUserLoggedIn={isUserLoggedIn}
                />

                <Title variant="h2">Все категории</Title>
              </Fragment>
            ) : (
              <PriceListFavoritesEmptyAlert isUserLoggedIn={isUserLoggedIn} />
            )}
          </Fragment>
        )}

        <PriceList
          positions={priceListPositions}
          favorites={userFavoritesGoods}
          hiddenSections={hiddenSectionsTitles}
          favoriteSections={favoriteSectionsTitles}
          isUserLoggedIn={isUserLoggedIn}
        />
      </div>

      <SearchInput />
    </div>
  );
}

export { PriceListPage };
