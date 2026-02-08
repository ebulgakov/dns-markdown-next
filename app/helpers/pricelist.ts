import { UserSections } from "@/types/user";
import {
  VisualizationGoods,
  VisualizationHeader,
  VisualizationOutputList,
  VisualizationSectionTitle
} from "@/types/visualization";

import type { PriceList } from "@/types/pricelist";

export const getFlatPriceList = (priceList: PriceList) => {
  return priceList.positions.flatMap(position => position.items);
};

export const getPriceListWithSortedPositions = (priceList: PriceList) => {
  return {
    ...priceList,
    positions: priceList.positions.sort((a, b) => a.title.localeCompare(b.title))
  };
};

export const getOptimizedFlatPriceListWithTitle = (priceList: PriceList): VisualizationGoods[] => {
  return priceList.positions
    .map(position =>
      position.items.map(
        (item): VisualizationGoods => ({
          ...item,
          type: "goods",
          sectionTitle: position.title
        })
      )
    )
    .flat();
};

export const getOptimizedFlatTitles = (priceList: PriceList): VisualizationHeader[] => {
  return priceList.positions.map(
    (position): VisualizationHeader => ({
      title: position.title,
      itemsCount: position.items.length,
      type: "header"
    })
  );
};

export const getOptimizedFlatTitlesFromGoods = (
  goods: VisualizationGoods[]
): VisualizationHeader[] => {
  const uniqueTitles = Array.from(new Set(goods.map(good => good.sectionTitle)));
  return uniqueTitles.map(
    (title): VisualizationHeader => ({
      title,
      itemsCount: goods.filter(good => good.sectionTitle === title).length,
      type: "header"
    })
  );
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
