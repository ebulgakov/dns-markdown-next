import getPerformance from "#helpers/get_performance.ts";
import updateFavorites from "./helpers/update_favorites.ts";
import { sendUpdatesEmail } from "#email/updates-email.ts";

import {
  getAnalysisGoodsByDateAdded,
  getLastPriceList,
  getAllNotificationUsers
} from "#api/get.ts";
import { updateUsersFavorites } from "#api/post.ts";

async function checkFavorites() {
  const city = process.env.CITY || "samara";

  const lastPriceList = await getLastPriceList(city);
  if (!lastPriceList) throw new Error("No last price list found");

  const goods = await getAnalysisGoodsByDateAdded({ date: lastPriceList.createdAt, city });
  const users = await getAllNotificationUsers(city);

  const updatedUsers = updateFavorites(users, goods);
  const sentNotificationUsers = await sendUpdatesEmail(updatedUsers);
  await updateUsersFavorites(sentNotificationUsers);
}

getPerformance(checkFavorites).then(() => {
  console.log("/************** FAVORITES CHECKED ****************/");
});
