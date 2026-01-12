import { getUser } from "@/db/user/queries";

export const getPriceListCity = async () => {
  const defaultCity = process.env.DEFAULT_CITY!;

  try {
    const user = await getUser();
    return user ? user.city : defaultCity;
  } catch {
    return defaultCity;
  }
};
