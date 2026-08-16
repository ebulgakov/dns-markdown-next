import type { FavoriteStatus } from "@/entities/user";
import type { AnalysisData } from "@/types/analysis-data";
import type { DiffHistory } from "@/types/analysis-diff";

export type ProductPayload = {
  item: AnalysisData;
  history: DiffHistory;
  status: FavoriteStatus;
};
