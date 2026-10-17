import type { Request } from "../request";
import type { AnalysisData } from "@dns-markdown/types/analysis-data";
import type { AnalysisDiff } from "@dns-markdown/types/analysis-diff";
import type { Position, PriceList } from "@dns-markdown/types/pricelist";
import type { User } from "@dns-markdown/types/user";

type CityDate = { city: string; date: string };

// /service/* routes: need serviceKey in the client config (used by the parser only)
export const createServiceApi = (request: Request) => ({
  getAllPriceLists: ({ city, limit }: { city: string; limit?: number }) =>
    request.get<PriceList[]>("/service/all-price-lists", { city, limit }),
  getAllNotificationUsers: (city: string) =>
    request.get<User[]>("/service/all-notification-users", { city }),
  savePriceList: (city: string, positions: Position[]) =>
    request.post<{ priceList: PriceList }>("/service/add-new-price-list", { city, positions }),
  deleteLastPriceList: (city: string) =>
    request.post<{ success: boolean }>("/service/delete-last-price-list", { city }),
  deleteOldPriceLists: (city: string) =>
    request.post<null>("/service/delete-old-price-lists", { city }),
  addNewReportByCity: (params: { city: string }) =>
    request.post<null>("/service/add-analysis-report", params),
  deleteReportByCityDate: (params: { city: string; dateAdded: string }) =>
    request.post<{ success: boolean }>("/service/delete-analysis-report-by-city-date", params),
  addManyAnalysisData: (params: { analysisData: AnalysisData[] }) =>
    request.post<null>("/service/insert-analysis-data", params),
  deleteAllAnalysisData: (city: string) =>
    request.post<null>("/service/delete-analysis-data", { city }),
  deleteAnalysisByDateData: ({ city, date }: CityDate) =>
    request.post<null>("/service/delete-analysis-data-by-date", { city, dateAdded: date }),
  addManyAnalysisDiff: (diff: AnalysisDiff[]) =>
    request.post<null>("/service/insert-analysis-diff", { diff }),
  deleteAnalysisDiffAll: (city: string) =>
    request.post<null>("/service/delete-analysis-diff", { city }),
  deleteAnalysisDiffByDate: ({ city, date }: CityDate) =>
    request.post<null>("/service/delete-analysis-diff-by-date", { city, dateAdded: date }),
  updateUsersFavorites: (users: User[]) =>
    request.post<null>("/service/update-users-favorites", { users }),
  clearCacheByKeys: (keys: string) => request.post<null>("/service/clear-cache-by-key", { keys })
});
