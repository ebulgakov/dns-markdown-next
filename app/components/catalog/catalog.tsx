"use client";

import { useWindowVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

import { CatalogFavoritesEmptyAlert } from "@/app/components/catalog/catalog-favorites-empty-alert";
import { getCurrentCatalogTitle } from "@/app/components/catalog/helpers/get-current-catalog-title";
import { ProductCard } from "@/app/components/product-card";
import { Title } from "@/app/components/ui/title";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { cn } from "@/app/lib/utils";
import { useSearchStore } from "@/app/stores/search-store";
import { UserSections } from "@/types/user";
import {
  VisualizationGoods,
  VisualizationHeader,
  VisualizationSectionTitle
} from "@/types/visualization";

import { CatalogHeader } from "./catalog-header";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { PriceList as PriceListType } from "@/types/pricelist";

type PageVariant = "archive" | "updates" | "default";

type PriceListPageProps = {
  variant: PageVariant;
  priceList: PriceListType;
  diffs?: DiffsType;
  hiddenSections: UserSections;
  onChangeHiddenSections?: (section: string) => void;
  customSortSections?: UserSections;
};

function Catalog({
  priceList,
  variant,
  diffs,
  hiddenSections,
  onChangeHiddenSections,
  customSortSections = []
}: PriceListPageProps) {
  const isUpdates = variant === "updates";
  const [scrollHeight, setScrollHeight] = useState(0);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const { flattenList, flattenTitles } = useFilteredGoods(
    isUpdates ? "" : debouncedSearch,
    priceList,
    {
      hiddenSections,
      customSortSections
    }
  );
  const isSearchMode = !isUpdates && debouncedSearch.length > 2;

  // Virtualization setup
  const listRef = useRef<HTMLDivElement>(null);
  const virtualizer = useWindowVirtualizer({
    count: flattenList.length,
    estimateSize: index => {
      if (flattenList[index].type === "header") return 60;
      return 220;
    },
    getItemKey: index => {
      const item = flattenList[index];
      if (!item) return index;
      if (item.type === "goods") return (item as VisualizationGoods)._id;
      if (item.type === "header") return `header-${(item as VisualizationHeader).title}`;
      if (item.type === "title") return `title-${(item as VisualizationSectionTitle).category}`;
      return index;
    },
    overscan: 5,
    scrollMargin: 100, // Equal -mt-25 -> 25 * 4. I need it for correct work of sticky header overlapping
    initialOffset: 0
  });
  const virtualItems = virtualizer.getVirtualItems();

  const currentTitle = getCurrentCatalogTitle(virtualItems, flattenList, flattenTitles);

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const title = decodeURIComponent(hash.slice(1));

      const index = flattenList.findIndex(item => {
        const header = item as VisualizationHeader;
        return header.type === "header" && header.title === title;
      });

      if (index !== -1) {
        const foundList = virtualizer.getOffsetForIndex(index, "start");
        if (foundList == null) return;

        const listOffset = listRef.current?.offsetTop ?? 0;
        const navHeightStr = getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-bar-height"
        );
        let navHeight = parseInt(navHeightStr) || 56; // height of navbar + search bar

        if (["default", "archive"].includes(variant)) {
          navHeight *= 2;
        }

        window.scrollTo({ top: foundList[0] + listOffset - navHeight + 10 }); // Additional 10px for better visibility of the header
        history.pushState(null, document.title, window.location.pathname + window.location.search);
      }
    };

    const timeoutId = setTimeout(handleHashScroll, 100); // Delay to ensure the page has rendered and virtualizer has calculated item positions
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
      clearTimeout(timeoutId);
    };
  }, [virtualizer, flattenList, variant]);

  useEffect(() => {
    setScrollHeight(virtualizer.getTotalSize());
  }, [virtualizer, flattenList.length]);

  return (
    <div ref={listRef} className="-mt-25">
      {currentTitle && (
        <div
          className={cn("fixed right-0 left-0 z-10 px-4", {
            "top-[calc(var(--nav-bar-height)_*_2)]": !isUpdates,
            "top-[var(--nav-bar-height)]": isUpdates
          })}
        >
          <div className="mx-auto md:container">
            <CatalogHeader
              city={priceList.city}
              disableCollapse={isSearchMode}
              shownHeart={!(["updates", "archive"] as PageVariant[]).includes(variant)}
              hiddenSections={hiddenSections}
              onOuterToggleHiddenSection={onChangeHiddenSections}
              header={currentTitle}
            />
          </div>
        </div>
      )}

      <div
        style={{
          height: `${scrollHeight}px`,
          width: "100%",
          position: "relative"
        }}
      >
        {virtualItems.map(virtualItem => {
          const item = flattenList[virtualItem.index];
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
              {item.type === "noFavsAlert" && !isUpdates && <CatalogFavoritesEmptyAlert />}

              {item.type === "foundTitle" && !isUpdates && (
                <Title variant="h3" className="mt-0 mb-5 flex h-12 items-center">
                  Найдено товаров: &nbsp;
                  <span className="font-normal">
                    {flattenList.filter(i => i.type === "goods").length}
                  </span>
                  &nbsp;
                </Title>
              )}

              {item.type === "header" && (
                <CatalogHeader
                  city={priceList.city}
                  disableCollapse={isSearchMode}
                  shownHeart={!(["updates", "archive"] as PageVariant[]).includes(variant)}
                  header={item as VisualizationHeader}
                  hiddenSections={hiddenSections}
                  onOuterToggleHiddenSection={onChangeHiddenSections}
                />
              )}

              {item.type === "goods" && (
                <div className="border-b border-neutral-300">
                  <ProductCard
                    shownFavorites={variant !== "archive"}
                    item={item as VisualizationGoods}
                    diff={diffs?.[`${(item as VisualizationGoods)._id}`]}
                  />
                </div>
              )}

              {item.type === "title" && !isUpdates && (
                <Title
                  variant="h2"
                  className={cn("mb-2", {
                    "mt-0": (item as VisualizationSectionTitle).category === "favorite"
                  })}
                >
                  {(item as VisualizationSectionTitle).category === "favorite"
                    ? "Избранные категории"
                    : "Все категории"}
                </Title>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Catalog };
