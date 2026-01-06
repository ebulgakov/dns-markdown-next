import { dbConnect, dbDisconnect } from "#db/database.js";
import getPerformance from "#helpers/get_performance.js";
import { getAllHistory } from "#db/history/queries/get_all_history.js";
import { getAllUsers } from "#db/user/queries/get_all_users.js";
import updateFavorites from "./helpers/update_favorites.js";
import { updateUsers } from "#db/user/mutations/update_users.js";

async function checkFavorites() {
  const city = process.env.CITY || 'samara';

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
