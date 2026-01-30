import { getUser } from "@/api";
import { dbConnect } from "@/db/database";

export const getPriceListCity = async () => {
  const defaultCity = process.env.DEFAULT_CITY || "samara"; // Fallback city

  await dbConnect();

  try {
    const user = await getUser();
    return user ? user.city : defaultCity;
  } catch {
    return defaultCity;
  }
};
