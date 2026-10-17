import type { Request } from "../request";
import type { AnalysisData } from "@dns-markdown/types/analysis-data";
import type { AnalysisDiff, AnalysisDiffReport } from "@dns-markdown/types/analysis-diff";
import type { PriceListsArchiveCount } from "@dns-markdown/types/pricelist";
import type { ReportsResponse } from "@dns-markdown/types/reports";

export const createAnalysisApi = (request: Request) => ({
  getLastDiff: (city: string) => request.get<AnalysisDiff>("/api/analysis/last-diff", { city }),
  getAllDiffs: (city: string) =>
    request.get<AnalysisDiffReport[]>("/api/analysis/all-diffs", { city }),
  getProductsCount: (city: string) =>
    request.get<PriceListsArchiveCount[]>("/api/analysis/products-count", { city }),
  getReports: (city: string) => request.get<ReportsResponse>("/api/analysis/reports", { city }),
  getTotalUniqProductsCount: (city: string) =>
    request.get<number>("/api/analysis/total-uniq-products-count", { city }),
  getGoodsByDateAdded: ({ city, date }: { city: string; date: string }) =>
    request.get<AnalysisData[]>("/api/analysis/all-analysis-goods-by-date-added", {
      city,
      dateAdded: date
    })
});
