import { dbConnect } from "@/db/database";
import { getUser } from "./get-user";

export const getUserSections = async () => {
  await dbConnect();
  const user = await getUser();

  return {
    favorites: user ? user.favoriteSections : undefined,
    hidden: user ? user.hiddenSections : undefined
  };
};
