import type { Goods } from "@/types/pricelist";

export type VisualizationGoods = Goods & {
  type: "goods";
  sectionTitle: string;
};

export type VisualizationHeader = {
  type: "header";
  title: string;
  itemsCount: number;
};

export type VisualizationSectionTitle = {
  type: "title";
  category: "favorite" | "other";
};

export type VisualizationNoFavsAlert = {
  type: "noFavsAlert";
};

export type VisualizationFoundTitle = {
  type: "foundTitle";
  titles: string[];
  goodsCount: number;
};

export type VisualizationOutput =
  | VisualizationFoundTitle
  | VisualizationNoFavsAlert
  | VisualizationGoods
  | VisualizationHeader
  | VisualizationSectionTitle;

export type VisualizationOutputList = VisualizationOutput[];
