import { User } from "#db/models/user_model.js";
import type { User as UserType } from "#types/user.js";

export const updateUsers = async (users: UserType[]) => {
  // TODO: optimize with bulkWrite
  for (const user of users) {
    await User.updateOne({ _id: user._id }, { $set: user }, { upsert: true });
  }
};
