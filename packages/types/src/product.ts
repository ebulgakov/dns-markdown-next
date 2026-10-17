import type { AnalysisData } from "./analysis-data";
import type { DiffHistory } from "./analysis-diff";
import type { FavoriteStatus } from "./user";

export type ProductPayload = {
  item: AnalysisData;
  history: DiffHistory;
  status: FavoriteStatus;
};
