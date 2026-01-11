"use server";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

export const toggleBoughtVisibilityFavorites = async (status: boolean) => {
  await dbConnect();

  const user = await updateUser({ shownBoughtFavorites: status });

  return user.shownBoughtFavorites;
};
