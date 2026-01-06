import { History } from "#db/models/history_model.js";

export const removeAllHistory = (city: string) => {
  return History.deleteMany({ city });
}
