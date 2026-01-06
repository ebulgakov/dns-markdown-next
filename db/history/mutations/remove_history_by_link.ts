import { History } from "#db/models/history_model.js";

export const removeHistoryByLink = async (link: string) => {
  return History.findOneAndDelete({ link }, { sort: { updatedAt: -1 } });
}
