import cron from "node-cron";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";
import Connection from "../models/Connection.js";
import { postToWooCommerce } from "../utils/woocommerceHelper.js";
import Topic from "../models/Topic.js";
import { generateDetailedReview } from "../utils/openaiHelper.js";
// import { testDeepSeekConnection } from '../utils/testDeepSeekConnection.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("✅ MongoDB Connected for Publisher"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// await testDeepSeekConnection();

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
      isPublished: false,
      scheduledAt: { $lte: now },
    });

    if (blogsToPublish.length === 0) {
      console.log("⏳ No blogs to publish at this time.");
    } else {
      console.log(`📌 Found ${blogsToPublish.length} blog(s) to publish:`);
      blogsToPublish.forEach((blog) => console.log(`   • ${blog.title}`));
    }

    for (const blog of blogsToPublish) {
      try {
        const topic = await Topic.findById(blog.topic);

        if (!topic) {
          console.warn(`⚠️ Topic not found for blog "${blog.title}"`);
          continue;
        }

        const platforms = topic.platforms || []; // ✅ this is the correct line

        let posted = false;

        for (const platform of platforms) {
          switch (platform.platform) {
            case "WooCommerce":
              if (platform.connectionId) {
                const connection = await Connection.findById(platform.connectionId);
                if (connection?.isActive) {
                  try {
                    await postToWooCommerce(connection, blog);
                    console.log(`🚀 Blog posted: ${blog.title} to ${connection.siteUrl}`);
                    posted = true;
                  } catch (err) {
                    console.error(`❌ Failed to post to ${connection.siteUrl}:`, err.message);
                  }
                } else {
                  console.warn(`⚠️ Inactive or missing WooCommerce connection for topic "${topic.title}"`);
                }
              }
              break;
            case "Shopify":
              // Handle Shopify publishing logic here
              break;
            case "Medium":
              // Handle Medium publishing logic here
              break;
            case "WordPress":
              // Handle WordPress publishing logic here
              break;
            default:
              console.warn(`⚠️ Platform not supported: ${platform.platform}`);
          }
        }

        if (posted) {
          blog.isPublished = true;
          blog.publishedAt = new Date();
          await blog.save();
        }
      } catch (err) {
        console.error(`❌ Error processing blog "${blog.title}":`, err.message);
      }
    }
  } catch (err) {
    console.error("❌ Error in publishing scheduled blogs:", err.message);
  }
};


// Schedule this to run every minute
cron.schedule("* * * * *", async () => {
  console.log("🕒 Checking for scheduled blogs to publish...");
  await createBlogsFromTopics();    
  await publishScheduledBlogs();
});

// import cron from "node-cron";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Blog from "../models/Blog.js";
// import Connection from "../models/Connection.js";
// import { postToWooCommerce } from "../utils/woocommerceHelper.js";
// import Topic from "../models/Topic.js";
// import { generateDetailedReview } from "../utils/openaiHelper.js";

// dotenv.config();

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
//   .then(() => console.log("✅ MongoDB Connected for Publisher"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// const createBlogsFromTopics = async () => {
//   const now = new Date();
//   const topicsToUse = await Topic.find({
//     used: false,
//     status: { $in: ["scheduled", "active"] },
//     scheduleTime: { $lte: now },
//   });

//   if (topicsToUse.length === 0) {
//     console.log("⏳ No new topics to convert into blogs.");
//     return;
//   }

//   console.log(`🆕 Found ${topicsToUse.length} topic(s) to convert into blogs:`);

//   for (const topic of topicsToUse) {
//     try {
//       console.log(`✍️ Generating blog for topic: "${topic.title}"`);

//       const content = await generateDetailedReview(topic.title);

//       const newBlog = new Blog({
//         title: topic.title,
//         content,
//         brand: topic.brandId,
//         topic: topic._id,
//         imageUrl: topic.imageUrl || null,
//         scheduledAt: topic.scheduleTime,
//         isPublished: false,
//         publishedAt: null,
//       });

//       await newBlog.save();
//       topic.used = true;
//       await topic.save();

//       console.log(`✅ Blog created and saved for topic: "${topic.title}"`);
//     } catch (err) {
//       console.error(`❌ Error generating blog for "${topic.title}":`, err.message);
//     }
//   }
// };


// const publishScheduledBlogs = async () => {
//   try {
//     const now = new Date();
//     const blogsToPublish = await Blog.find({
//       isPublished: false,
//       scheduledAt: { $lte: now },
//     });

//     if (blogsToPublish.length === 0) {
//       console.log("⏳ No blogs to publish at this time.");
//     } else {
//       console.log(`📌 Found ${blogsToPublish.length} blog(s) to publish:`);
//       blogsToPublish.forEach((blog) => console.log(`   • ${blog.title}`));
//     }

//     for (const blog of blogsToPublish) {
//       try {
//         const topic = await Topic.findById(blog.topic);

//         if (!topic) {
//           console.warn(`⚠️ Topic not found for blog "${blog.title}"`);
//           continue;
//         }

//         const platforms = topic.platforms || []; // ✅ this is the correct line

//         let posted = false;

//         for (const platform of platforms) {
//           if (platform.platform === "WooCommerce" && platform.connectionId) {
//             const connection = await Connection.findById(platform.connectionId);

//             if (connection && connection.isActive) {
//               try {
//                 await postToWooCommerce(connection, blog);
//                 console.log(`🚀 Blog posted: ${blog.title} to ${connection.siteUrl}`);
//                 posted = true;
//               } catch (err) {
//                 console.error(`❌ Failed to post to ${connection.siteUrl}:`, err.message);
//               }
//             } else {
//               console.warn(`⚠️ Inactive or missing connection for WooCommerce in topic "${topic.title}"`);
//             }
//           }
//         }

//         if (posted) {
//           blog.isPublished = true;
//           blog.publishedAt = new Date();
//           await blog.save();
//         }
//       } catch (err) {
//         console.error(`❌ Error processing blog "${blog.title}":`, err.message);
//       }
//     }
//   } catch (err) {
//     console.error("❌ Error in publishing scheduled blogs:", err.message);
//   }
// };



// // Schedule this to run every minute
// cron.schedule("* * * * *", async () => {
//   console.log("🕒 Checking for scheduled blogs to publish...");
//   await createBlogsFromTopics();    
//   await publishScheduledBlogs();
// });





