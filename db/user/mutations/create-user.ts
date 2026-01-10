"use server";
import { dbConnect } from "@/db/database";
import { User } from "@/db/models/user-model";

type CreateUserInput = {
  userId: string;
  email?: string;
  username?: string;
};
export const createUser = async ({ userId, email, username }: CreateUserInput) => {
  await dbConnect();
  await User.create({ userId, email, username });
};
