import { getAuth } from "@clerk/express";
import { User } from "@src/db/models/user";
import { hiddenSectionRemoveSchema } from "@src/user-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function hiddenRemoveHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = hiddenSectionRemoveSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }

    const { title } = validationResult.data;
    const { userId } = getAuth(req);

    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(401).send("Authentication required. User identity not found.");
    }

    const user = await User.findOneAndUpdate(
      { userId: userId.trim() },
      { $pull: { hiddenSections: title } },
      { new: true, runValidators: true }
    ).exec();

    if (!user) return res.status(404).send("User not found");
    res.json({
      message: "Section removed from hidden sections",
      sections: user.hiddenSections
    });
  } catch (error) {
    next(error);
  }
}

export default hiddenRemoveHandler;
