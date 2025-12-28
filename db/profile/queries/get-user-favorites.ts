import { dbConnect } from "@/db/database";
import { getUser } from "./get-user";

export const getUserFavorites = async () => {
  await dbConnect();
  const user = await getUser();

  return user ? user.favorites.reverse() : [];
};
