import { User } from "#db/models/user_model.ts";
export const getAllUsers = (city: string) => {
  return User.find({ city }, {}, { sort: { updatedAt: -1 } });
};
