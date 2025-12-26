import { dbConnect } from "@/db/database";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/db/models/user_model";
import { HourlyPricelist, Pricelist } from "@/db/models/pricelist_model";
import { History } from "@/db/models/history_model";

const getUser = async () => {
  await dbConnect();
  const clerkUser = await currentUser();

  return User.findOne({ userId: clerkUser?.id });
};

export const getLastPriceList = async () => {
  await dbConnect();
  const user = await getUser();

  return HourlyPricelist.findOne({ city: user.city }, {}, { sort: { updatedAt: -1 } });
};

export const getArchiveList = async () => {
  await dbConnect();
  const user = await getUser();

  return Pricelist.find({ city: user.city }, {}, { sort: { updatedAt: 1 } }).select("createdAt");
};

export const getPriceListById = async (id: string) => {
  await dbConnect();
  return Pricelist.findOne({ _id: id });
};

export const getProductById = async (id: string) => {
  await dbConnect();

  const history = await History.findOne({ link: id }, {}, { sort: { updatedAt: -1 } });
  const priceList = await HourlyPricelist.findOne(
    { city: history.city },
    {},
    { sort: { updatedAt: -1 } }
  );

  // TODO: ADD a pricelist type
  const positions = priceList.toObject().positions.flatMap((positionGroup: { items: never; }) => positionGroup.items);
  const item = positions.find((position: { link: string; }) => position.link === id);

  item.city = history.city; // Added city specially for adding to favorites

  return { item, history };
};
