import { getAuth } from "@clerk/express";
import { User } from "@src/db/models/user";

import type { NextFunction, Request, Response } from "express";

async function userByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = getAuth(req);

    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(401).send("Authentication required. User identity not found.");
    }

    const user = await User.findOne({ userId: userId.trim() }).lean().exec();

    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export default userByIdHandler;
