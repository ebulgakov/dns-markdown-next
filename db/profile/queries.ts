import { dbConnect } from "@/db/database";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/db/models/user_model";
import type { User as UserType } from "@/types/user";

export const getUser = async () => {
  await dbConnect();
  const clerkUser = await currentUser();

  return User.findOne({ userId: clerkUser?.id }) as unknown as UserType | undefined;
};

export const getUserFavorites = async () => {
  await dbConnect();
  const user = await getUser();

  return user ? user.favorites.reverse() : [];
};
