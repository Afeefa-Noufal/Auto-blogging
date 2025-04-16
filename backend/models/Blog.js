import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: false },
  imageUrl: { type: String }, 
  isPublished: { type: Boolean, default: false },
  scheduledAt: { type: Date },
});


export default mongoose.model("Blog", blogSchema);



