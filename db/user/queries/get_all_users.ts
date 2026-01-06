import { User } from "../../models/user_model.ts";
export const getAllUsers = (city: string) => {
  return User.find({ city }, {}, { sort: { updatedAt: -1 } });
};
