import { currentUser } from "@clerk/nextjs/server";

import { get as cacheGet, add as cacheAdd } from "@/cache";
import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import type { User as UserType } from "@/types/user";

export const getUser = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) throw new Error("User not authenticated");

  const key = `user:${String(clerkUser.id)}`;
  const cached = await cacheGet<UserType>(key);
  if (cached) return cached;

  await dbConnect();

  const user = await User.findOne({ userId: clerkUser.id });
  if (!user) throw new Error("User not found");

  const plainUser = JSON.stringify(user);

  await cacheAdd(key, plainUser);

  return JSON.parse(plainUser) as UserType;
};
