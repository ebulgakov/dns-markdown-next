import { dbConnect, dbDisconnect } from "../db/database.ts";
import { removeAllHistory } from "../db/history/mutations/remove_all_history.ts";
import { getAllPriceLists } from "../db/pricelist/queries/get_all_price_lists.ts";
import makeHistory from "./helpers/make_history.ts";
import { addManyHistory } from "../db/history/mutations/add_many_history.ts";
import getPerformance from "../helpers/get_performance.ts";

async function addHistory() {
  const city = process.env.CITY;

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
