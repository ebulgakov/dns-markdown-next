import type { AnalysisData } from "@/types/analysis-data";
import type { DiffHistory } from "@/types/analysis-diff";
import type { FavoriteStatus } from "@/types/user";

export type ProductPayload = {
  item: AnalysisData;
  history: DiffHistory;
  status: FavoriteStatus;
};
