"use server";
import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { updateUser } from "@/db/profile/mutations/update-user";

export const removeFromFavorites = async (link: string) => {
  await dbConnect();

  const user = await getUser();

  if (!user) throw new Error("User not found");

  const update = {
    favorites: user.favorites.filter(item => String(item.item.link) !== link)
  };

  await updateUser(update);
  return true;
};
