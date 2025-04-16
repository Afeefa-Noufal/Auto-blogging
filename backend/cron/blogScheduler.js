import cron from "node-cron";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";
import Connection from "../models/Connection.js";
import { postToWooCommerce } from "../utils/woocommerceHelper.js";
import Topic from "../models/Topic.js";
import { generateDetailedReview } from "../utils/openaiHelper.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("✅ MongoDB Connected for Publisher"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const createBlogsFromTopics = async () => {
  const now = new Date();
  const topicsToUse = await Topic.find({
    used: false,
    status: { $in: ["scheduled", "active"] },
    scheduleTime: { $lte: now },
  });

  if (topicsToUse.length === 0) {
    console.log("⏳ No new topics to convert into blogs.");
    return;
  }

  console.log(`🆕 Found ${topicsToUse.length} topic(s) to convert into blogs:`);

  for (const topic of topicsToUse) {
    try {
      console.log(`✍️ Generating blog for topic: "${topic.title}"`);

      const content = await generateDetailedReview(topic.title);

      const newBlog = new Blog({
        title: topic.title,
        content,
        brand: topic.brandId,
        topic: topic._id,
        imageUrl: topic.imageUrl || null,
        scheduledAt: topic.scheduleTime,
        isPublished: false,
        publishedAt: null,
      });

      await newBlog.save();
      topic.used = true;
      await topic.save();

      console.log(`✅ Blog created and saved for topic: "${topic.title}"`);
    } catch (err) {
      console.error(`❌ Error generating blog for "${topic.title}":`, err.message);
    }
  }
};


const publishScheduledBlogs = async () => {
  try {
    const now = new Date();
    const blogsToPublish = await Blog.find({
      isPublished: false, // Only unpublished blogs
      scheduledAt: { $lte: now }, // Blog scheduled at or before current time
    });


    // if (blogsToPublish.length === 0) {
    //   console.log("⏳ No blogs to publish at this time.");
    //   return;
    // }
    if (blogsToPublish.length === 0) {
      console.log("⏳ No blogs to publish at this time.");
    } else {
      console.log(`📌 Found ${blogsToPublish.length} blog(s) to publish:`);
      blogsToPublish.forEach((blog) => console.log(`   • ${blog.title}`));
    }
    

    for (const blog of blogsToPublish) {
      const connections = await Connection.find({
        brandId: blog.brand,
        platform: "WooCommerce",
        isActive: true,
      });

      let posted = false;

      for (const conn of connections) {
        try {
          await postToWooCommerce(conn, blog);
          console.log(`🚀 Blog posted: ${blog.title} to ${conn.siteUrl}`);
          posted = true;
        } catch (err) {
          console.error(`❌ Failed posting to ${conn.siteUrl}:`, err.message);
        }
      }

      // Mark as published if successfully posted
      if (posted) {
        blog.isPublished = true;
        blog.publishedAt = new Date();
        await blog.save();
      }
    }
  } catch (err) {
    console.error("❌ Error in publishing scheduled blogs:", err);
  }
};

// Schedule this to run every minute
cron.schedule("* * * * *", async () => {
  console.log("🕒 Checking for scheduled blogs to publish...");
  await createBlogsFromTopics();    
  await publishScheduledBlogs();
});





