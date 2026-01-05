import "dotenv/config";
import { dbConnect, dbDisconnect } from "../db/database.ts";
import { getAllPriceLists } from "../db/pricelist/queries/get_all_price_lists.ts";
import { removeDiff } from "../db/diff/mutations/remove_diff.ts";
import makeDiff from "./helpers/make_diff.ts";
import { addDiff } from "../db/diff/mutations/add_diff.ts";

async function addDiffCollection() {
  const city = process.env.CITY;

  await dbConnect();
  await removeDiff(city);

  const [last, prev] = await getAllPriceLists(city);
  const diff = makeDiff(last, prev);
  await addDiff(city, diff.changesPrice, diff.changesProfit);

  await dbDisconnect();
}

addDiffCollection().then(() => {
  console.log("/************** DIFF ADDED ****************/");
});
