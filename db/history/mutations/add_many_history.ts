import { History } from "../../models/history_model.ts";
import { type History as HistoryType } from "../../../types/history.ts";

export const addManyHistory = async (history: HistoryType[]) => {
  return History.insertMany(history);
};
