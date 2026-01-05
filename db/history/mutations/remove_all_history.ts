import { History } from "../../models/history_model.ts";

export const removeAllHistory = (city: string) => {
  return History.deleteMany({ city });
}
