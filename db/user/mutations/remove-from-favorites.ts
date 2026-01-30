"use server";
import { getUser } from "@/api";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

export const removeFromFavorites = async (link: string) => {
  if (!link) throw new Error("No link provided");

  await dbConnect();

  const user = await getUser();

  if (!user) throw new Error("User not found");

  const update = { favorites: user.favorites.filter(item => String(item.item.link) !== link) };
  await updateUser(update);

  return true;
};
