import { getAuth } from "@clerk/express";
import { User } from "@src/db/models/user";
import { toggleShownBoughtFavoritesSchema } from "@src/user-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function toggleShownBoughtFavoritesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = toggleShownBoughtFavoritesSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }

    const { status } = validationResult.data;
    const { userId } = getAuth(req);

    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(401).send("Authentication required. User identity not found.");
    }

    const user = await User.findOneAndUpdate(
      { userId: userId.trim() },
      { $set: { shownBoughtFavorites: status } },
      { new: true, runValidators: true }
    ).exec();

    if (!user) return res.status(404).send("User not found");
    res.json({
      message: "Show bought favorites status updated",
      shownBoughtFavorites: user.shownBoughtFavorites
    });
  } catch (error) {
    next(error);
  }
}

export default toggleShownBoughtFavoritesHandler;
