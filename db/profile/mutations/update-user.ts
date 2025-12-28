import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user_model";
import { getUser } from "@/db/profile/queries";

export const updateUser = async (update: object) => {
  await dbConnect();

  const user = await getUser();

  if (!user) return null;

  await User.findByIdAndUpdate(user.id, update, { new: true });
};
