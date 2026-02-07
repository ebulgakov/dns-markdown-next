"use client";

import { useWindowVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useDebounce } from "@uidotdev/usehooks";
import { X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

import { Filter } from "@/app/components/filter";
import {
  PriceListSection,
  PriceListStickySection
} from "@/app/components/price-list/price-list-section";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Title } from "@/app/components/ui/title";
import { UserContext } from "@/app/contexts/user-context";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { cn } from "@/app/lib/utils";
import { useSearchStore } from "@/app/stores/search-store";
import { UserSections } from "@/types/user";
import {
  VisualizationGoods,
  VisualizationHeader,
  VisualizationSectionTitle
} from "@/types/visualization";

import { PriceListFavoritesEmptyAlert } from "./price-list-favorites-empty-alert";
import { PriceListGoods } from "./price-list-goods";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { PriceList as PriceListType } from "@/types/pricelist";

type PageVariant = "archive" | "updates" | "default";

type PriceListPageProps = {
  variant: PageVariant;
  priceList: PriceListType;
  diffs?: DiffsType;
  customHiddenSections?: UserSections;
  customSortSections?: UserSections;
};

function PriceListPage({
  priceList,
  variant,
  diffs,
  customHiddenSections = [],
  customSortSections = []
}: PriceListPageProps) {
  const [scrollHeight, setScrollHeight] = useState(0);
  // Initialize hidden sections with no saving sections to user
  const [hiddenSections, setHiddenSections] = useState<UserSections>(customHiddenSections);

  const { favoriteSections } = useContext(UserContext);
  const onChangeSearch = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const { flattenList, flattenTitles } = useFilteredGoods(debouncedSearch, priceList, {
    hiddenSections,
    customSortSections
  });
  const isSearchMode = debouncedSearch.length > 2;

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
    scrollMargin: 0,
    initialOffset: 0
  });
  const virtualItems = virtualizer.getVirtualItems();

  const onToggleSection = (sectionId: string) => {
    setHiddenSections(prevState =>
      prevState.includes(sectionId)
        ? prevState.filter(id => id !== sectionId)
        : [...prevState, sectionId]
    );
  };

  const getTitle = (): string | undefined => {
    const [firstVItem] = virtualItems;

    if (firstVItem && firstVItem.index < 1) return;

    const extractTitle = (vItem: VirtualItem) => {
      const item = flattenList[vItem.index];

      if (
        (item as VisualizationGoods).type === "goods" &&
        (item as VisualizationGoods).sectionTitle
      ) {
        return (item as VisualizationGoods).sectionTitle;
      }

      if ((item as VisualizationHeader).type === "header" && (item as VisualizationHeader).title) {
        return (item as VisualizationHeader).title;
      }
      return undefined;
    };

    const cutVirtualItems = virtualItems.slice(4);
    const foundHeaderIdx = cutVirtualItems.find(extractTitle);
    return foundHeaderIdx ? extractTitle(foundHeaderIdx) : undefined;
  };

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
          "--nav-bar-offset"
        );
        const navHeight = parseInt(navHeightStr) || 56; // height of navbar

        window.scrollTo({ top: foundList[0] + listOffset - navHeight });
      }
    };

    const timeoutId = setTimeout(handleHashScroll, 100); // Delay to ensure the page has rendered and virtualizer has calculated item positions
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
      clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setScrollHeight(virtualizer.getTotalSize());
  }, [virtualizer, flattenList.length]);

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
            Найдено товаров: <b>{flattenList.length}</b>
          </div>
        </div>
      )}

      {!isSearchMode && favoriteSections.length === 0 && <PriceListFavoritesEmptyAlert />}

      <PriceListStickySection
        neededTitle={getTitle()}
        shownHeart={!(["updates", "archive"] as PageVariant[]).includes(variant)}
        outerHiddenSections={variant === "updates" ? hiddenSections : undefined}
        onOuterToggleHiddenSection={variant === "updates" ? onToggleSection : undefined}
        titles={flattenTitles}
      />

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
              {item.type === "header" && (
                <PriceListSection
                  shownHeart={!(["updates", "archive"] as PageVariant[]).includes(variant)}
                  header={item as VisualizationHeader}
                  outerHiddenSections={variant === "updates" ? hiddenSections : undefined}
                  onOuterToggleHiddenSection={variant === "updates" ? onToggleSection : undefined}
                />
              )}

              {item.type === "goods" && (
                <div className="border-b border-neutral-300">
                  <PriceListGoods
                    shownFavorites={variant !== "archive"}
                    item={item as VisualizationGoods}
                    diff={diffs?.[`${(item as VisualizationGoods)._id}`]}
                  />
                </div>
              )}

              {item.type === "title" && variant !== "updates" && (
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

      <ScrollToTop variant="filter" />
      <Filter priceList={priceList} foundCount={flattenList.length} />
    </div>
  );
}

export { PriceListPage };
