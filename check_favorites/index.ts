import { dbConnect, dbDisconnect } from "#db/database.ts";
import getPerformance from "#helpers/get_performance.ts";
import { getAllUsers } from "#db/user/queries/get_all_users.ts";
import updateFavorites from "./helpers/update_favorites.ts";
import { updateUsers } from "#db/user/mutations/update_users.ts";
import { getLastPriceList } from "#db/pricelist/queries/get_last_price_list.ts";
import { getAnalysisGoodsByParam } from "#db/analysis_data/queries/get-analysis-goods-by-param.ts";
import { sendUpdatesEmail } from "#email/updates-email.ts";

async function checkFavorites() {
  const city = process.env.CITY || 'samara';

  await dbConnect();

  const lastPriceList = await getLastPriceList(city);
  if (!lastPriceList)  throw new Error("No last price list found");

  const goods = await getAnalysisGoodsByParam({
    param: "dateAdded",
    value: lastPriceList.createdAt,
    city
  })
  const users = await getAllUsers(city).select("favorites email notifications").exec();
  const updatedUsers = updateFavorites(users, goods);
  const sentNotificationUsers = await sendUpdatesEmail(updatedUsers);
  await updateUsers(sentNotificationUsers);

  await dbDisconnect();
}

getPerformance(checkFavorites).then(() => {
  console.log("/************** FAVORITES CHECKED ****************/");
});
