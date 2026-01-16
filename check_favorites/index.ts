import { dbConnect, dbDisconnect } from "#db/database.js";
import getPerformance from "#helpers/get_performance.js";
import { getAllUsers } from "#db/user/queries/get_all_users.js";
import updateFavorites from "./helpers/update_favorites.js";
import { updateUsers } from "#db/user/mutations/update_users.js";
import { getLastPriceList } from "#db/pricelist/queries/get_last_price_list.js";
import { getAnalysisGoodsByParam } from "#db/analysis_data/queries/get-analysis-goods-by-param.js";

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
  const users = await getAllUsers(city).select("favorites").exec();
  const updatedUsers = updateFavorites(users, goods);
  await updateUsers(updatedUsers);

  await dbDisconnect();
}

getPerformance(checkFavorites).then(() => {
  console.log("/************** FAVORITES CHECKED ****************/");
});
