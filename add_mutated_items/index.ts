import "dotenv/config";
import { dbConnect, dbDisconnect } from "../db/database.ts";
import { getAllPriceLists } from "../db/pricelist/queries/get_all_price_lists.ts";
import {
  removeRemovedGoods,
  removeNewGoods
} from "../db/pricelist/mutated_goods/mutations/remove_goods.ts";
import { addRemovedGoods, addNewGoods } from "../db/pricelist/mutated_goods/mutations/add_goods.ts";
import getMutatedGoods from "./helpers/get_mutated_goods.ts";

async function addMutatedItems() {
  const city = process.env.CITY;

  await dbConnect();
  await removeRemovedGoods(city);
  await removeNewGoods(city);
  const [last, prev] = await getAllPriceLists(city);

  const { removedGoods, addedGoods } = getMutatedGoods(last, prev);

  await addRemovedGoods(city, removedGoods);
  await addNewGoods(city, addedGoods);

  await dbDisconnect();
}

addMutatedItems().then(() => {
  console.log("/************** MUTATED ITEMS ADDED ****************/");
});
