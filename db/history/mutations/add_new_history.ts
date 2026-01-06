import { History } from "#db/models/history_model.js";

export const addNewHistory = async (historyData: typeof History.schema) => {
  const history = new History(historyData);
  await history.save();
  return history;
}
