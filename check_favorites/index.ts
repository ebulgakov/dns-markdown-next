import { dbConnect, dbDisconnect } from "../db/database.ts";
import getPerformance from "../helpers/get_performance.ts";
import { getAllHistory } from "../db/history/queries/get_all_history.ts";
import { getAllUsers } from "../db/user/queries/get_all_users.ts";
import updateFavorites from "./helpers/update_favorites.ts";
import { updateUsers } from "../db/user/mutations/update_users.ts";

async function checkFavorites() {
  const city = process.env.CITY;

  await dbConnect();

  const history = await getAllHistory(city);
  const users = await getAllUsers(city).select("favorites").exec();
  const updatedUsers = updateFavorites(users, history);
  await updateUsers(updatedUsers);

  await dbDisconnect();
}

getPerformance(checkFavorites).then(() => {
  console.log("/************** FAVORITES CHECKED ****************/");
});
