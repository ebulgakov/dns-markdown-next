"use server";
import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";
import { getUser } from "@/db/user/queries";

import type { User as UserType } from "@/types/user";

export const updateUser = async (update: object): Promise<UserType | null> => {
  await dbConnect();

  const user = await getUser();

  if (!user) throw new Error("User not found");

  return User.findByIdAndUpdate(user.id, update, { new: true });
};
