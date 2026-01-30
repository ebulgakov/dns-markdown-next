"use server";
import { getUser } from "@/api";
import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import type { User as UserType } from "@/types/user";

export const updateUser = async (update: object): Promise<UserType> => {
  await dbConnect();

  const user = await getUser();

  if (!user) throw new Error("User not found");

  const newUser = (await User.findByIdAndUpdate(user._id, update, { new: true })) as UserType;

  if (!newUser) throw new Error("Failed to update user");

  return JSON.parse(JSON.stringify(newUser)) as UserType;
};
