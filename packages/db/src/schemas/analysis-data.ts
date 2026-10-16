import Goods from "./goods";

const analysisDataSchema = Goods.clone();

analysisDataSchema.add({
  city: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  dateAdded: { type: Date, default: Date.now, index: true }
});

export default analysisDataSchema;
