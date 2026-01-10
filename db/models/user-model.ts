import mongoose from "mongoose";

import Goods from "./goods-schema";

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    city: {
      type: String,
      default: "samara"
    },
    hiddenSections: [String],
    favoriteSections: [String],
    notifications: {
      updates: {
        interval: {
          type: String,
          default: "never"
        },
        fields: {
          new: {
            type: Boolean,
            default: false
          },
          prices: {
            type: Boolean,
            default: false
          },
          profit: {
            type: Boolean,
            default: false
          }
        }
      },
      favorites: {
        interval: {
          type: String,
          default: "never"
        }
      },
      favoriteSections: {
        interval: {
          type: String,
          default: "never"
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
