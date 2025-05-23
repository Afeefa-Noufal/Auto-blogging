import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "scheduled", "completed"] },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  used: { type: Boolean, default: false },
  imageUrl: String,
  scheduleTime: { type: Date },
  platforms: [{
    platform: { type: String, enum: ["WooCommerce", "Shopify", "Medium", "WordPress"] },
    connectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Connection", required: true }
  }]
});

export default mongoose.model("Topic", topicSchema);





