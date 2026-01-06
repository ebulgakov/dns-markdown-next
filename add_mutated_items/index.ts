import "dotenv/config";
import { dbConnect, dbDisconnect } from "#db/database.js";
import { getAllPriceLists } from "#db/pricelist/queries/get_all_price_lists.js";
import { removeRemovedGoods, removeNewGoods } from "#db/mutated_goods/mutations/remove_goods.js";
import { addRemovedGoods, addNewGoods } from "#db/mutated_goods/mutations/add_goods.js";
import getMutatedGoods from "./helpers/get_mutated_goods.js";
import getPerformance from "#helpers/get_performance.js";

async function addMutatedItems() {
  const city = process.env.CITY || "samara";

  await dbConnect();

  await removeRemovedGoods(city);
  await removeNewGoods(city);
  const [last, prev] = await getAllPriceLists(city);

  const { removedGoods, addedGoods } = getMutatedGoods(last, prev);

  await addRemovedGoods(city, removedGoods);
  await addNewGoods(city, addedGoods);

  await dbDisconnect();
}

getPerformance(addMutatedItems).then(() => {
  console.log("/************** MUTATED ITEMS ADDED ****************/");
});
