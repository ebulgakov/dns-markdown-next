import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user_model";

export const createUser = async (id: string) => {
  await dbConnect();
  await User.create({ userId: id });
}
