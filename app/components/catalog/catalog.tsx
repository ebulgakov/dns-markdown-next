"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

import { CatalogFavoritesEmptyAlert } from "@/app/components/catalog/catalog-favorites-empty-alert";
import { getCurrentCatalogTitle } from "@/app/components/catalog/helpers/get-current-catalog-title";
import { CatalogComponentVariant } from "@/app/components/catalog/types";
import { ProductCard } from "@/app/components/product-card";
import { Title } from "@/app/components/ui/title";
import { useCatalogVirtualizer } from "@/app/hooks/use-catalog-virtualizer";
import { useFilteredGoods } from "@/app/hooks/use-filtered-goods";
import { cn } from "@/app/lib/utils";
import { useSearchStore } from "@/app/stores/search-store";

import { CatalogHeader } from "./catalog-header";

import type { DiffsCollection as DiffsType } from "@/types/analysis-diff";
import type { PriceList as PriceListType } from "@/types/pricelist";

type PriceListPageProps = {
  variant: CatalogComponentVariant;
  priceList: PriceListType;
  diffs?: DiffsType;
};

function Catalog({ priceList, variant, diffs }: PriceListPageProps) {
  const isUpdates = variant === "updates";
  const [scrollHeight, setScrollHeight] = useState(0);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const debouncedSearch = useDebounce<string>(searchTerm.trim(), 100);
  const { flattenList, flattenTitles } = useFilteredGoods({
    term: debouncedSearch,
    priceList,
    variant
  });
  const isSearchMode = !isUpdates && debouncedSearch.length > 1;

  // Virtualization setup
  const listRef = useRef<HTMLDivElement>(null);
  const virtualizer = useCatalogVirtualizer({ flattenList, variant, listRef });
  const virtualItems = virtualizer.getVirtualItems();
  const currentTitle = getCurrentCatalogTitle(virtualItems, flattenList, flattenTitles);

  useEffect(() => {
    // After filtering the list, we need to update the total scroll height for virtualization
    setScrollHeight(virtualizer.getTotalSize());
  }, [virtualizer, flattenList.length]);

  return (
    <div ref={listRef} data-testid="catalog-list" className="-mt-25">
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
              shownHeart={!(["updates", "archive"] as CatalogComponentVariant[]).includes(variant)}
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
              {item.type === "noFavsAlert" && <CatalogFavoritesEmptyAlert />}

              {item.type === "foundTitle" && (
                <Title variant="h3" className="mt-0 mb-5 flex h-12 items-center">
                  Найдено товаров: &nbsp;
                  <span className="font-normal">
                    {flattenList.filter(i => i.type === "goods").length}
                  </span>
                </Title>
              )}

              {item.type === "header" && (
                <CatalogHeader
                  city={priceList.city}
                  disableCollapse={isSearchMode}
                  shownHeart={!["updates", "archive"].includes(variant)}
                  header={item}
                />
              )}

              {item.type === "goods" && (
                <div className="border-b border-neutral-300">
                  <ProductCard
                    shownFavorites={variant !== "archive"}
                    item={item}
                    diff={diffs?.[item._id]}
                  />
                </div>
              )}

              {item.type === "title" && (
                <Title
                  variant="h2"
                  className={cn("mb-2", { "mt-0": item.category === "favorite" })}
                >
                  {item.category === "favorite" ? "Избранные категории" : "Все категории"}
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
