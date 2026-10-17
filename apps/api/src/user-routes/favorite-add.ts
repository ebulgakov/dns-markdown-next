import { getAuth } from "@clerk/express";
import { User } from "@dns-markdown/db/models/user";
import { addFavoriteSchema } from "@src/user-routes/helpers/schemas";
import { ObjectId } from "mongodb";
import { z } from "zod";

import type { Favorite } from "@dns-markdown/types/user";
import type { NextFunction, Request, Response } from "express";

async function addFavoriteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = addFavoriteSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.error(validationResult.error);
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }

    const { product } = validationResult.data;
    const { userId } = getAuth(req);

    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(401).send("Authentication required. User identity not found.");
    }

    const { city, ...productWithoutCity } = product;

    const item: Favorite = {
      _id: new ObjectId().toHexString(),
      status: {
        city,
        deleted: false,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      item: productWithoutCity
    };
    const user = await User.findOneAndUpdate(
      {
        userId: userId.trim(),
        "favorites.item.link": { $ne: product.link } // Assuming 'link' is a unique identifier for the product
      },
      { $addToSet: { favorites: item } },
      { new: true, runValidators: true }
    ).exec();

    // Check if the user was found and the item was added
    if (!user) {
      // Check if the user exists to differentiate between user not found and item already in favorites
      const existingUser = await User.findOne({ userId: userId.trim() }).select("favorites").exec();
      if (!existingUser) return res.status(404).send("User not found");

      return res
        .status(409)
        .json({ message: "Item already in favorites", favorites: existingUser.favorites });
    }

    res.json({ message: "Item added to favorites", favorites: user.favorites });
  } catch (error) {
    next(error);
  }
}
export default addFavoriteHandler;
