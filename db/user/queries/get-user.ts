import { currentUser } from "@clerk/nextjs/server";

import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import type { User as UserType } from "@/types/user";

export const getUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");

  await dbConnect();

  const user = await User.findOne({ userId: clerkUser.id });
  if (!user) throw new Error("User not found");

  return JSON.parse(JSON.stringify(user)) as UserType;
};
