import { User } from "@src/db/models/user";
import { citySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function allNotificationUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = citySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const users = await User.find(
      { city, favorites: { $gt: [] }, "notifications.updates.enabled": true },
      {},
      { sort: { updatedAt: -1 } }
    )
      .select("favorites email userId")
      .exec();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export default allNotificationUsersHandler;
