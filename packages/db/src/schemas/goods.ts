import mongoose from "mongoose";

const goodsSchema = new mongoose.Schema({
  title: String,
  link: { type: String, index: true },
  description: String,
  reasons: [
    {
      label: String,
      text: String
    }
  ],
  priceOld: String,
  price: String,
  profit: String,
  code: String,
  image: String,
  available: String
});

export default goodsSchema;
