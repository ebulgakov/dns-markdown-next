import "dotenv/config";
import { dbConnect, dbDisconnect } from "#db/database.js";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.js";
import { removeDiff } from "#db/diff/mutations/remove_diff.js";
import makeDiff from "./helpers/make_diff.js";
import { addDiff } from "#db/diff/mutations/add_diff.js";
import getPerformance from "#helpers/get_performance.js";

async function addDiffCollection() {
  const city = process.env.CITY || "samara";

  await dbConnect();

  await removeDiff(city);
  const [last, prev] = await getAllPriceLists(city);
  const diff = makeDiff(last, prev);
  await addDiff(city, diff.changesPrice, diff.changesProfit);

  await dbDisconnect();
}

getPerformance(addDiffCollection).then(() => {
  console.log("/************** DIFF ADDED ****************/");
});
