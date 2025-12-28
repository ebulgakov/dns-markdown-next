import { dbConnect } from "@/db/database";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/db/models/user_model";
import type { User as UserType } from "@/types/user";

export const getUser = async () => {
  await dbConnect();
  const clerkUser = await currentUser();

  const user = await User.findOne({ userId: clerkUser?.id });

  return user || undefined;
};
