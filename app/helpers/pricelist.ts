import { UserSections } from "@/types/user";
import {
  VisualizationGoods,
  VisualizationHeader,
  VisualizationOutputList,
  VisualizationSectionTitle,
  VisualizationType
} from "@/types/visualization";

import type { PriceList } from "@/types/pricelist";

export const getFlatPriceList = (priceList: PriceList) => {
  return priceList.positions.flatMap(position => position.items);
};
export const getOptimizedFlatPriceListWithTitle = (priceList: PriceList): VisualizationGoods[] => {
  return priceList.positions
    .map(position =>
      position.items.map(item => ({
        ...item,
        type: "goods" as VisualizationType,
        sectionTitle: position.title
      }))
    )
    .flat();
};

export const getOptimizedFlatTitles = (priceList: PriceList): VisualizationHeader[] => {
  return priceList.positions
    .map(position => ({
      title: position.title,
      itemsCount: position.items.length,
      type: "header" as VisualizationType
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
};

export const getOptimizedFlatTitlesFromGoods = (
  goods: VisualizationGoods[]
): VisualizationHeader[] => {
  const uniqueTitles = Array.from(new Set(goods.map(good => good.sectionTitle)));
  return uniqueTitles.map(title => ({
    title,
    itemsCount: goods.filter(good => good.sectionTitle === title).length,
    type: "header" as VisualizationType
  }));
};

export const getOptimizedOutput = (
  goods: VisualizationGoods[],
  headers: VisualizationHeader[],
  {
    favoriteSections,
    hiddenSections
  }: {
    favoriteSections: UserSections;
    hiddenSections: UserSections;
  }
): VisualizationOutputList => {
  const output: VisualizationOutputList = [];

  const favoriteTitle: VisualizationSectionTitle = {
    category: "favorite",
    type: "title"
  };

  const otherTitle: VisualizationSectionTitle = {
    category: "other",
    type: "title"
  };
  const nonFavoriteSections = headers
    .filter(header => !favoriteSections.some(title => title === header.title))
    .map(header => header.title);

  const titles: UserSections = [...favoriteSections, ...nonFavoriteSections];

  titles.forEach(title => {
    const header = headers.find(h => h.title === title);
    if (!header) return;

    if (title === favoriteSections[0]) {
      output.push(favoriteTitle);
    }

    if (title === nonFavoriteSections[0]) {
      output.push(otherTitle);
    }

    output.push(header);

    if (!hiddenSections.includes(title)) {
      const relatedGoods = goods.filter(good => good.sectionTitle === header.title);
      output.push(...relatedGoods);
    }
  });

  return output;
};
