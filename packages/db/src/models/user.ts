import mongoose from "mongoose";

import userSchema from "../schemas/user";

import type { User as UserType } from "../types/user";

export const User = mongoose.models.User || mongoose.model<UserType>("User", userSchema);
