"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@uidotdev/usehooks";
import { X } from "lucide-react";
import { useContext, useEffect, useRef } from "react";

import { Filter } from "@/app/components/filter";
import { PriceListSection } from "@/app/components/price-list/price-list-section";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Title } from "@/app/components/ui/title";
import { UserContext } from "@/app/contexts/user-context";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { useSearchStore } from "@/app/stores/search-store";
import {
  VisualizationGoods,
  VisualizationHeader,
  VisualizationSectionTitle
} from "@/types/visualization";

import { PriceListFavoritesEmptyAlert } from "./price-list-favorites-empty-alert";
import { PriceListGoods } from "./price-list-goods";

import type { PriceList as PriceListType } from "@/types/pricelist";

type PriceListPageProps = {
  variant?: "archive";
  priceList: PriceListType;
};

function PriceListPage({ priceList, variant }: PriceListPageProps) {
  const { favoriteSections } = useContext(UserContext);
  const onChangeSearch = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const filteredList = useFilteredGoods(debouncedSearch, priceList);
  const isSearchMode = debouncedSearch.length > 2;

  // Virtualization setup
  const listRef = useRef<HTMLDivElement>(null);
  const virtualizer = useWindowVirtualizer({
    count: filteredList.length,
    estimateSize: index => {
      if (filteredList[index].type === "header") return 60;
      return 220;
    },
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const title = decodeURIComponent(hash.slice(1));

        const index = filteredList.findIndex(item => {
          const header = item as VisualizationHeader;
          return header.type === "header" && header.title === title;
        });

        if (index !== -1) {
          const foundList = virtualizer.getOffsetForIndex(index, "start");
          if (!foundList) return;

          const listOffset = listRef.current?.offsetTop ?? 0;
          const navHeightStr = getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-bar-offset"
          );
          const navHeight = parseInt(navHeightStr) || 56; // height of navbar

          window.scrollTo({
            top: foundList[0] + listOffset - navHeight,
            behavior: "smooth"
          });
        }
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [filteredList, virtualizer]);

  return (
    <div data-testid="price-list-page" ref={listRef}>
      {isSearchMode && (
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
      )}

      {!isSearchMode && favoriteSections.length === 0 && <PriceListFavoritesEmptyAlert />}

      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative"
        }}
      >
        {virtualItems.map(virtualItem => {
          const item = filteredList[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              {item.type === "header" && (
                <PriceListSection shownHeart header={item as VisualizationHeader} />
              )}

              {item.type === "goods" && (
                <div className="border-b border-neutral-300">
                  <PriceListGoods
                    shownFavorites={variant !== "archive"}
                    item={item as VisualizationGoods}
                    // diff={...}
                  />
                </div>
              )}

              {item.type === "title" && (
                <Title variant="h2" className="mb-2">
                  {(item as VisualizationSectionTitle).category === "favorite"
                    ? "Избранные категории"
                    : "Все категории"}
                </Title>
              )}
            </div>
          );
        })}
      </div>

      <ScrollToTop variant="filter" />
      <Filter priceList={priceList} foundCount={filteredList.length} />
    </div>
  );
}

export { PriceListPage };
