"use client";
import { SearchInput } from "@/app/components/search-input";
import { PriceList } from "./price-list";
import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";
import { useSearchStore } from "@/app/stores/search-store";
import { PriceListGoods } from "./price-list-goods";
import { useDebounce } from "@/app/hooks/useDebounce";
import { PriceListFavoritesSection } from "./price-list-favorites-section";
import clsx from "clsx";
import { useFilteredGoods } from "@/app/hooks/useFilteredGoods";
import { useSortGoodsStore } from "@/app/stores/sort-goods-store";

type PriceListPageProps = {
  favoriteSections?: PositionType[];
  userFavoritesGoods?: FavoriteType[];
  hiddenSectionsTitles?: UserSectionsType;
  nonFavoriteSections?: PositionType[];
  priceList: PriceListType;
};

function PriceListPage({
  favoriteSections,
  userFavoritesGoods,
  hiddenSectionsTitles,
  nonFavoriteSections,
  priceList
}: PriceListPageProps) {
  const sortGoods = useSortGoodsStore(state => state.sortGoods);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm, 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList, sortGoods);

  return (
    <>
      <SearchInput />

      {filteredList.map(item => (
        <PriceListGoods key={item._id} item={item} favorites={userFavoritesGoods} />
      ))}

      <div className={clsx({ hidden: searchTerm.length > 1 || sortGoods !== "default" })}>
        {favoriteSections && (
          <PriceListFavoritesSection
            favoriteSections={favoriteSections}
            hiddenSectionsTitles={hiddenSectionsTitles}
            userFavoritesGoods={userFavoritesGoods}
          />
        )}

        <PriceList
          positions={
            nonFavoriteSections && nonFavoriteSections.length > 0
              ? nonFavoriteSections
              : priceList.positions
          }
          favorites={userFavoritesGoods}
          hiddenSections={hiddenSectionsTitles}
        />
      </div>
    </>
  );
}

export { PriceListPage };
