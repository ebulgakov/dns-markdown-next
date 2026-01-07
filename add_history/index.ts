import { dbConnect, dbDisconnect } from "#db/database.js";
import { removeAllHistory } from "#db/history/mutations/remove_all_history.js";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.js";
import makeHistory from "./helpers/make_history.js";
import { addManyHistory } from "#db/history/mutations/add_many_history.js";
import getPerformance from "#helpers/get_performance.js";

async function addHistory() {
  const city = process.env.CITY || "samara";

  await dbConnect();

  await removeAllHistory(city);
  const priceLists = await getAllPriceLists(city);
  const history = makeHistory(priceLists);
  await addManyHistory(history);

  await dbDisconnect();
}

getPerformance(addHistory).then(() => {
  console.log("/************** HISTORY ADDED ****************/");
});
