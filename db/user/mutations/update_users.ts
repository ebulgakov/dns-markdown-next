import { User } from "../../models/user_model.ts";
import { type User as UserType } from "../../../types/user.ts";

export const updateUsers = async (users: UserType[]) => {
  if (users.length === 0) return;
  for (const user of users) {
    await User.updateOne({ _id: user._id }, { $set: user }, { upsert: true });
  }
};
