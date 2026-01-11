"use server";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";
import { getUser } from "@/db/user/queries";

export const removeFromFavorites = async (link: string) => {
  if (!link) throw new Error("No link provided");

  await dbConnect();

  const user = await getUser();
  const update = { favorites: user.favorites.filter(item => String(item.item.link) !== link) };
  await updateUser(update);

  return true;
};
