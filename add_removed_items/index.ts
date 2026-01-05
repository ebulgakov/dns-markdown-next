import "dotenv/config";
import { dbConnect, dbDisconnect } from "../db/database.ts";
import { getAllPriceLists } from "../db/pricelist/queries/get_all_price_lists.ts";
import { removeRemovedGoods } from "../db/pricelist/removed_goods/mutations/remove_removed_goods.ts";
import { addRemovedGoods } from "../db/pricelist/removed_goods/mutations/add_removed_goods.ts";
import getRemovedGoods from "./helpers/get_removed_goods.ts";

export default async function addRemovedItems() {
  const city = process.env.CITY;

  await dbConnect();
  await removeRemovedGoods(city);
  const [last, prev] = await getAllPriceLists(city);

  const goods = getRemovedGoods(last, prev);

  await addRemovedGoods(city, goods);

  await dbDisconnect();
}

addRemovedItems().then(() => {
  console.log("/************** REMOVED ITEMS ADDED ****************/");
});
