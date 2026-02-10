import type {
  VisualizationGoods,
  VisualizationHeader,
  VisualizationOutputList
} from "@/types/visualization";
import type { VirtualItem } from "@tanstack/react-virtual";

export const getCurrentCatalogTitle = (
  virtualItems: VirtualItem[],
  flattenList: VisualizationOutputList,
  flattenTitles: VisualizationHeader[]
): VisualizationHeader | undefined => {
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

  const foundHeaderIdx = virtualItems.find(extractTitle);
  const neededTitle = foundHeaderIdx ? extractTitle(foundHeaderIdx) : undefined;
  return flattenTitles.find(title => title.title === neededTitle);
};
