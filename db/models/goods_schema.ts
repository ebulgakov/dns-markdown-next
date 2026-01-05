import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  link: String,
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

export default schema;
