export { ProductCard } from "./ui/product-card";
export { ProductCardDiff } from "./ui/product-card-diff";
export { ProductCardCompareButton } from "./ui/product-card-compare-button";
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

// LLM report functions live here alongside the rest of get.ts pending the
// features/llm-report migration stage — features may import entities freely.
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
