export { ProductCard } from "./ui/product-card";
export { ProductCardDiff } from "./ui/product-card-diff";
export { ProductCardFavoriteToggle } from "./ui/product-card-favorite-toggle";

export { usePriceListStore } from "./model/pricelist-store";
export type { PriceListStore } from "./model/pricelist-store";

export type {
  Goods,
  RemovedGoods,
  PriceList,
  PriceListDate,
  PriceListsArchiveCount,
  Position
} from "./model/pricelist";
export type { ProductPayload } from "./model/product";

export {
  getFlatPriceList,
  getPriceListWithSortedPositions,
  getOptimizedFlatPriceListWithTitle,
  getOptimizedFlatTitles,
  getOptimizedFlatTitlesFromGoods,
  getOptimizedOutput
} from "./lib/pricelist";

// LLM report *generation* functions stay here (part of get.ts's cached
// external-API layer, only consumed by app/api/*/route.ts handlers — not by
// the features/llm-report UI, which calls those routes over HTTP instead).
// The compare-button *component* moved to features/llm-report/ui since it's
// UI, not API.
export {
  getLastPriceList,
  getArchiveListDates,
  getPriceListById,
  getProductByLink,
  getMostCheapProducts,
  getMostDiscountedProducts,
  getMostProfitableProducts,
  getLastDiffByCity,
  getLast30DiffsReportByCity,
  getLast30ArchiveProductsCount,
  getLast30ReportsByCity,
  getTotalUniqProductsCount,
  getLLMCompareProducts,
  getLLMDescribeProduct
} from "./api/get";
