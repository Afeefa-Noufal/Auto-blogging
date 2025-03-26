import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String }, // ✅ Add this field to store the image URL
  publishedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blog", blogSchema);

