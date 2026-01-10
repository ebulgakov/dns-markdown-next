import { currentUser } from "@clerk/nextjs/server";

import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

import type { User as UserType } from "@/types/user";

export const getUser = async () => {
  await dbConnect();
  const clerkUser = await currentUser();

  return User.findOne({ userId: clerkUser?.id }) as unknown as UserType | null;
};
