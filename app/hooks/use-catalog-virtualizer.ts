import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect } from "react";

import { CatalogComponentVariant } from "@/app/components/catalog/types";
import { VisualizationHeader, VisualizationOutputList } from "@/types/visualization";

type UseCatalogVirtualizerProps = {
  flattenList: VisualizationOutputList;
  listRef: React.RefObject<HTMLDivElement | null>;
  variant: CatalogComponentVariant;
};

export const useCatalogVirtualizer = ({
  flattenList,
  listRef,
  variant
}: UseCatalogVirtualizerProps) => {
  const virtualizer = useWindowVirtualizer({
    count: flattenList.length,
    estimateSize: index => {
      if (flattenList[index].type === "header") return 60;
      return 220;
    },
    getItemKey: index => {
      const item = flattenList[index];
      if (!item) return index;
      if (item.type === "goods") return item._id;
      if (item.type === "header") return `header-${item.title}`;
      if (item.type === "title") return `title-${item.category}`;
      return index;
    },
    overscan: 0,
    scrollMargin: 152, // Equal -mt-38 -> 38 * 4. I need it for correct work of sticky header overlapping
    initialOffset: 0
  });

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

        // Need to update the scroll position after the virtualizer has recalculated item positions
        setTimeout(() => {
          handleHashScroll();
          history.pushState(null, document.title, window.location.pathname);
        }, 100);
      }
    };

    const timeoutId = setTimeout(handleHashScroll, 100); // Delay to ensure the page has rendered and virtualizer has calculated item positions
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashScroll);
      clearTimeout(timeoutId);
    };
  }, [virtualizer, flattenList, variant, listRef]);

  return virtualizer;
};
