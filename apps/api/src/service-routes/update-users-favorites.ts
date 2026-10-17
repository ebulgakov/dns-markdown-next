import { User } from "@src/db/models/user";
import { updateUsersFavoritesBodySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function updateUsersFavoritesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = updateUsersFavoritesBodySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { users } = validationResult.data;

    const bulkOps = users.map(user => ({
      updateOne: {
        filter: { userId: user.userId },
        update: { favorites: user.favorites }
      }
    }));

    await User.bulkWrite(bulkOps);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default updateUsersFavoritesHandler;
