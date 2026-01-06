import { History } from "../../models/history_model.ts";

export const addNewHistory = async (historyData: typeof History.schema) => {
  const history = new History(historyData);
  await history.save();
  return history;
}
