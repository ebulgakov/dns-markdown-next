"use server";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

export const toggleBoughtVisibilityFavorites = async (status: boolean) => {
  await dbConnect();

  const user = await getUser();

  if (!user) throw new Error("User not found");

  const newUser = await updateUser({
    shownBoughtFavorites: status
  });

  if (!newUser) throw new Error("Failed to update user");

  return newUser.shownBoughtFavorites;
};
