import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., "WooCommerce"
  siteUrl: { type: String, required: true }, // WooCommerce site URL
  consumerKey: { type: String, required: true }, // API key
  consumerSecret: { type: String, required: true }, // API secret
  isActive: { type: Boolean, default: true }, // Enable/Disable auto-posting
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Connection", connectionSchema);