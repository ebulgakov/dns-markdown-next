import { History } from "#db/models/history_model.js";
export const updateHistoryByLink = async (
  link: string,
  updateData: Partial<typeof History.schema>
) => {
  return History.findOneAndUpdate({ link }, updateData, { new: true, sort: { updatedAt: -1 } });
};
