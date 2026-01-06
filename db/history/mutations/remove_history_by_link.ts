import { History } from "../../models/history_model.ts";

export const removeHistoryByLink = async (link: string) => {
  return History.findOneAndDelete({ link }, { sort: { updatedAt: -1 } });
}
