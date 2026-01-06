import { Diff } from "#db/models/diff_model.js";

export const removeDiff = (city: string) => {
  return Diff.deleteOne({ city });
};
