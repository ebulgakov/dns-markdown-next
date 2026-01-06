import { History } from "#db/models/history_model.js";

export const getAllHistory = async (city: string) => {
  return History.find({ city }, {}, { sort: { updatedAt: -1 } });
};
