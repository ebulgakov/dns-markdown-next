import type { Goods } from "@/types/pricelist";

export type VisualizationType = "title" | "header" | "goods" | "noFavsAlert" | "foundTitle";

export type VisualizationGoods = Goods & {
  type: VisualizationType;
  sectionTitle: string;
};

export type VisualizationHeader = {
  title: string;
  itemsCount: number;
  type: VisualizationType;
};

export type VisualizationSectionTitle = {
  category: "favorite" | "other";
  type: VisualizationType;
};

export type VisualizationNoFavsAlert = {
  type: VisualizationType;
};

export type VisualizationFoundTitle = {
  type: VisualizationType;
};

export type VisualizationOutput =
  | VisualizationFoundTitle
  | VisualizationNoFavsAlert
  | VisualizationGoods
  | VisualizationHeader
  | VisualizationSectionTitle;

export type VisualizationOutputList = VisualizationOutput[];
