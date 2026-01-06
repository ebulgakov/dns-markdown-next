import { History } from "#db/models/history_model.js";
import type { History as HistoryType } from "#types/history.js";

export const addManyHistory = async (history: HistoryType[]) => {
  return History.insertMany(history);
};
