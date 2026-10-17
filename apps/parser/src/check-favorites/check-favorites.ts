import { api } from "@src/api/client";
import { sendUpdatesEmail } from "@src/email/updates-email";
import { env } from "@src/env";

import updateFavorites from "./helpers/update-favorites";

export async function checkFavorites() {
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  const lastPriceList = await api.pricelist.getLast(city);
  if (!lastPriceList) throw new Error("No last price list found");

  const goods = await api.analysis.getGoodsByDateAdded({ date: lastPriceList.createdAt, city });
  const users = await api.service.getAllNotificationUsers(city);

  const { users: updatedUsers, statuses } = updateFavorites(users, goods);
  await sendUpdatesEmail(updatedUsers, statuses);
  await api.service.updateUsersFavorites(updatedUsers);
}
