import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., "WooCommerce", "Medium"
  siteUrl: { type: String, required: true },   // Platform base URL
  
  // WooCommerce REST API credentials
  consumerKey: { type: String },
  consumerSecret: { type: String },
  
  // WordPress Application Password (for posting to WP/Woo)
  username: { type: String },
  appPassword: { type: String },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Connection", connectionSchema);
