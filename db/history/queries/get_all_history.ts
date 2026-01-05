import { History } from "../../models/history_model.ts";

export const getAllHistory = async (city: string) => {
  return History.find({ city }, {}, { sort: { updatedAt: -1 } });
};
