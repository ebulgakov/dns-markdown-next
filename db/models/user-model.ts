import mongoose from "mongoose";

import Goods from "./goods-schema";

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    city: {
      type: String,
      default: "samara"
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: false,
      default: ""
    },
    shownBoughtFavorites: {
      type: Boolean,
      default: false
    },
    hiddenSections: [String],
    favoriteSections: [String],
    notifications: {
      updates: {
        enabled: {
          type: Boolean,
          default: false
        }
      }
    },
    favorites: [
      {
        status: {
          city: String,
          updatedAt: String,
          createdAt: String,
          deleted: Boolean,
          updates: Array
        },
        item: Goods
      }
    ]
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model("User", schema);
