import cron from "node-cron";
import Blog from "../models/Blog.js";
import Topic from "../models/Topic.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateDetailedReview } from "../utils/openaiHelper.js";

dotenv.config();

// Ensure database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("✅ MongoDB Connected for Scheduler"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const autoGenerateBlog = async () => {
  try {
    console.log("🔄 Checking for active topics...");

    // Fetch an 'active' topic that has no associated blog
    const topic = await Topic.findOne({
      status: "active",
      title: { $nin: await Blog.distinct("title") }, // Ensure no duplicate blog exists
    });

    if (!topic) {
      console.log("⚠ No new active topics found.");
      return;
    }

    console.log(`📝 Generating blog for topic: ${topic.title}`);

    // Generate blog content using OpenAI
    const content = await generateDetailedReview(topic.title);

    // Save new blog entry
    await Blog.create({
      title: topic.title,
      content,
      imageUrl: topic.imageUrl || "",
      publishedAt: new Date(),
    });

    console.log(`✅ Blog posted: ${topic.title}`);

    // Update topic status to "completed"
    await Topic.findByIdAndUpdate(topic._id, { status: "completed" });

  } catch (error) {
    console.error("❌ Error in auto-generating blog:", error);
  }
};

// Schedule task to run every 10 minutes
cron.schedule("*/2 * * * *", async () => {
  console.log("⏳ Running scheduled blog upload...");
  await autoGenerateBlog();
});
