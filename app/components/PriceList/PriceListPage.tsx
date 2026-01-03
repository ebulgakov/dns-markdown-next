"use client";
import SearchInput from "@/app/components/SearchInput";
import PriceList from "@/app/components/PriceList/PriceList";
import type { Position as PositionType, PriceList as PriceListType } from "@/types/pricelist";
import type { Favorite as FavoriteType, UserSections as UserSectionsType } from "@/types/user";
import { useSearchStore } from "@/app/stores/searchStore";
import PriceListGoods from "@/app/components/PriceList/PriceListGoods";
import { useDebounce } from "@/app/hooks/useDebounce";
import PriceListFavoritesSection from "@/app/components/PriceList/PriceListFavoritesSection";
import clsx from "clsx";
import { useFilteredGoods } from "@/app/hooks/useFilteredGoods";

type PriceListPageProps = {
  favoriteSections?: PositionType[];
  userFavoritesGoods?: FavoriteType[];
  hiddenSectionsTitles?: UserSectionsType;
  nonFavoriteSections?: PositionType[];
  priceList: PriceListType;
};

export default function PriceListPage({
  favoriteSections,
  userFavoritesGoods,
  hiddenSectionsTitles,
  nonFavoriteSections,
  priceList
}: PriceListPageProps) {
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm, 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList);

  return (
    <>
      <SearchInput />

      {filteredList.map(item => (
        <PriceListGoods key={item._id} item={item} favorites={userFavoritesGoods} />
      ))}

      <div className={clsx({ hidden: searchTerm.length > 1 })}>
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
