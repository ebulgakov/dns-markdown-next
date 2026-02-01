import type { AnalysisData } from "./analysis-data.ts";
import type { DiffHistory } from "./analysis-diff.ts";
import type { FavoriteStatus } from "./user.ts";

export type ProductPayload = {
  item: AnalysisData;
  history: DiffHistory;
  status: FavoriteStatus;
};
