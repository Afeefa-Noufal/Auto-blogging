import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String},
  platforms: [{
    platform: { type: String, enum: ["WooCommerce", "Shopify", "Medium", "WordPress"], required: true },
    connectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Connection", required: false }, // Optional, can be filled later
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Brand", BrandSchema);

