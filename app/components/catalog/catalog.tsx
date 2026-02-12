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

type PriceListPageProps = {
  variant: CatalogComponentVariant;
};

function Catalog({ variant }: PriceListPageProps) {
  const searchTerm = useDebounce<string>(useSearchStore(state => state.searchTerm).trim(), 100);
  const { flattenList, flattenTitles } = useFilteredGoods({
    filterTerm: searchTerm,
    hasNoModifyOutput: variant === "updates"
  });
  const [scrollHeight, setScrollHeight] = useState(0);
  const disabledCollapse = variant !== "updates" && searchTerm.length > 0;

  // Virtualization setup
  const listRef = useRef<HTMLDivElement>(null);
  const virtualizer = useCatalogVirtualizer({
    flattenList,
    withStickySearch: variant !== "updates",
    listRef
  });
  const virtualItems = virtualizer.getVirtualItems();
  const currentTitle = getCurrentCatalogTitle(virtualItems, flattenList, flattenTitles);

  useEffect(() => {
    // After filtering the list, we need to update the total scroll height for virtualization
    setScrollHeight(virtualizer.getTotalSize());
  }, [virtualizer, flattenList.length]);

  return (
    <div
      ref={listRef}
      data-testid="catalog-list"
      className="relative -mt-38 w-full"
      style={{ height: `${scrollHeight}px` }}
    >
      {currentTitle && (
        <div
          className={cn("fixed right-0 left-0 z-10 px-4", {
            "top-[calc(var(--nav-bar-height)_*_2)]": variant !== "updates",
            "top-[var(--nav-bar-height)]": variant === "updates"
          })}
        >
          <div className="mx-auto md:container">
            <CatalogHeader
              disabledCollapse={disabledCollapse}
              shownHeart={variant === "default"}
              header={currentTitle}
            />
          </div>
        </div>
      )}

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
              <div>
                <Title variant="h3" className="mt-0 mb-5 flex h-12 items-center">
                  Найдено товаров: &nbsp;
                  <span className="font-normal">{item.goodsCount}</span>
                </Title>

                <div>
                  {item.titles.map(title => (
                    <div key={title} className="mb-2">
                      <a
                        href={`#${encodeURIComponent(title)}`}
                        className="hover:text-primary cursor-pointer text-sm text-gray-500"
                        onClick={e => {
                          e.preventDefault();
                          window.location.assign(`#${encodeURIComponent(title)}`);
                        }}
                      >
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.type === "header" && (
              <CatalogHeader
                disabledCollapse={disabledCollapse}
                shownHeart={variant === "default"}
                header={item}
              />
            )}

            {item.type === "goods" && (
              <div className="border-b border-neutral-300">
                <ProductCard
                  shownFavorites={variant !== "archive"}
                  shownCompares={variant === "default"}
                  sectionTitle={item.sectionTitle}
                  item={item}
                />
              </div>
            )}

            {item.type === "title" && (
              <Title variant="h2" className={cn("mb-2", { "mt-0": item.category === "favorite" })}>
                {item.category === "favorite" ? "Избранные категории" : "Все категории"}
              </Title>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { Catalog };
