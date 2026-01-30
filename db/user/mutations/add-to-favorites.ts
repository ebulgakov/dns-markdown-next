"use server";
import { getUser } from "@/api";
import { dbConnect } from "@/db/database";
import { updateUser } from "@/db/user/mutations/update-user";

import type { Goods } from "@/types/pricelist";

export const addToFavorites = async (goods: Goods) => {
  if (!goods) throw new Error("No goods provided");

  await dbConnect();

  const user = await getUser();

  if (!user) throw new Error("User not found");

  const update = {
    favorites: [
      ...user.favorites,
      {
        status: {
          city: goods.city || user.city,
          deleted: false,
          createdAt: new Date()
        },
        item: goods
      }
    ]
  };
  await updateUser(update);

  return true;
};
