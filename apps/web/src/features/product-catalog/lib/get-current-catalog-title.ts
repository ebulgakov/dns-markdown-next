import type { VisualizationHeader, VisualizationOutputList } from "@/types/visualization";
import type { VirtualItem } from "@tanstack/react-virtual";

export const getCurrentCatalogTitle = (
  virtualItems: VirtualItem[],
  flattenList: VisualizationOutputList,
  flattenTitles: VisualizationHeader[]
): VisualizationHeader | undefined => {
  const [firstVItem] = virtualItems;

  if (firstVItem && firstVItem.index < 1) return;

  const extractTitle = (vItem?: VirtualItem) => {
    if (!vItem) return;
    const item = flattenList[vItem.index];
    if (item.type === "goods" && item.sectionTitle) return item.sectionTitle;
    if (item.type === "header" && item.title) return item.title;
  };

  const foundHeaderIdx = virtualItems.find(extractTitle);
  return flattenTitles.find(title => title.title === extractTitle(foundHeaderIdx));
};
