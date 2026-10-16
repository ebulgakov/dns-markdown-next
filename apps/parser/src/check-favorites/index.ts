import {
  getAnalysisGoodsByDateAdded,
  getLastPriceList,
  getAllNotificationUsers
} from "@src/api/get";
import { updateUsersFavorites } from "@src/api/post";
import { sendUpdatesEmail } from "@src/email/updates-email";
import { env } from "@src/env";
import getPerformance from "@src/helpers/get-performance";

import updateFavorites from "./helpers/update-favorites";

async function checkFavorites() {
  const city = env.CITY;

  if (!city) throw new Error("No city found");

  const lastPriceList = await getLastPriceList(city);
  if (!lastPriceList) throw new Error("No last price list found");

  const goods = await getAnalysisGoodsByDateAdded({ date: lastPriceList.createdAt, city });
  const users = await getAllNotificationUsers(city);

  const { users: updatedUsers, statuses } = updateFavorites(users, goods);
  await sendUpdatesEmail(updatedUsers, statuses);
  await updateUsersFavorites(updatedUsers);
}

getPerformance(checkFavorites)
  .then(() => {
    console.log("/************** FAVORITES CHECKED ****************/");
  })
  .catch(err => {
    console.error("Error checking favorites:", err);
    process.exit(1);
  });
