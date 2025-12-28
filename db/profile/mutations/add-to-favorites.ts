import { dbConnect } from "@/db/database";
import { getUser } from "@/db/profile/queries";
import { Goods } from "@/types/pricelist";
import { updateUser } from "@/db/profile/mutations/update-user";

export const addToFavorites = async (goods: Goods) => {
  await dbConnect();

  const user = await getUser();

  if (!user) return null;

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
};
