import { dbConnect, dbDisconnect } from "../db/database.ts";
import { getAllHistory } from "../db/history/queries/get_all_history.ts";
import { getLastPriceList } from "../db/pricelist/queries/get_last_price_list.ts";
import makeHistoryAndGetResult from "./helpers/make_history_and_get_result.ts";
import { removeHistoryByLink } from "../db/history/mutations/remove_history_by_link.ts";
import { updateHistoryByLink } from "../db/history/mutations/update_history_by_link.ts";
import { addNewHistory } from "../db/history/mutations/add_new_history.ts";

async function addHistory() {
  const city = process.env.CITY;

  await dbConnect();

  const history = await getAllHistory(city);
  const priceList = await getLastPriceList(city);
  const { outdatedHistory, updatedHistory, newHistory } = makeHistoryAndGetResult(
    priceList,
    history
  );

  for (const record of outdatedHistory) {
    await removeHistoryByLink(record.link);
  }

  for (const record of updatedHistory) {
    await updateHistoryByLink(record.link, record);
  }

  for (const record of newHistory) {
    await addNewHistory(record);
  }

  await dbDisconnect();
}

addHistory().then(() => {
  console.log("/************** HISTORY ADDED ****************/");
});
