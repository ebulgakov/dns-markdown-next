import { dbConnect } from "@/db/database";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/db/models/user_model";
import { HourlyPricelist } from "@/db/models/pricelist_model";

const getPriceList = async () => {
  await dbConnect();
  const clerkUser = await currentUser();
  const user = await User.findOne({ userId: clerkUser?.id });
  return HourlyPricelist.findOne({ city: user.city }, {}, { sort: { updatedAt: -1 } });
};

export default async function CatalogPage() {
  const priceList = await getPriceList();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Catalog Page</h1>
      <pre className="text-lg">{JSON.stringify(priceList, null, 2)}</pre>
    </div>
  );
}
