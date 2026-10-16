import mongoose from "mongoose";

import Goods from "./goods";

const userSchema = new mongoose.Schema(
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
          city: {
            type: String,
            default: "samara"
          },
          updatedAt: String,
          createdAt: String,
          deleted: Boolean
        },
        item: Goods
      }
    ]
  },
  {
    timestamps: true
  }
);

export default userSchema;
