import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
  brand: {type: mongoose.Schema.Types.ObjectId,ref: "Brand",required: true}, // Make it required
});

export default mongoose.model("Blog", blogSchema);


