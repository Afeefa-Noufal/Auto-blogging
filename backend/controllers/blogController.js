import Blog from "../models/Blog.js";
import { generateDetailedReview } from "../utils/openaiHelper.js";
import dotenv from "dotenv";
import getConnectionByPlatform from "../helpers/getConnectionByPlatform.js";
import axios from "axios";
import uploadImageToWooCommerce from "../utils/uploadImageToWooCommerce.js";
import Topic from "../models/Topic.js";


dotenv.config();

export const createBlog = async (req, res) => {
  try {
    const { title, brand } = req.body;

    if (!title || !brand) {
      return res.status(400).json({ message: "Title and brand are required" });
    }

    // 🧠 Find topic with either "scheduled" or "active" status (in case you use both)
    const topic = await Topic.findOne({
      title,
      brandId: brand,
      status: { $in: ["scheduled", "active"] },
      used: false,
    });

    if (!topic) {
      return res.status(404).json({ message: `No matching topic found for title: "${title}" and brand: ${brand}` });
    } else {
      console.log("✅ Matching topic found:", topic);
    }

    let content = "";
    try {
      content = await generateDetailedReview(title);
    } catch (err) {
      console.error("❌ Failed to generate blog content:", err.message);
      return res.status(500).json({ message: "Failed to generate content" });
    }

    const newBlog = new Blog({
      title,
      content,
      brand,
      topic: topic._id,
      imageUrl: topic?.imageUrl || null,
      scheduledAt: topic?.scheduleTime || null,
      isPublished: topic?.scheduleTime ? false : true,
      publishedAt: topic?.scheduleTime ? null : new Date(),
    });

    console.log("📦 Saving blog:", newBlog);

    // 🔁 Better error logging when saving
    try {
      await newBlog.save();
      console.log("📝 Blog saved:", newBlog.title);
    } catch (saveErr) {
      console.error("❌ Error saving blog to DB:", saveErr.message);
      return res.status(500).json({ message: "Error saving blog" });
    }

    topic.used = true;
    await topic.save();
    console.log("🔄 Topic marked as used");

    res.status(201).json(newBlog);
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const publishBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("topic");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.isPublished) {
      return res.status(400).json({ message: "Blog has already been published to WooCommerce" });
    }

    const connection = await getConnectionByPlatform("WooCommerce", blog.brand); // 🧠 if multi-brand
    if (!connection) {
      return res.status(404).json({ message: "No WooCommerce connection found" });
    }

    const { siteUrl, username, appPassword } = connection;
    if (!username || !appPassword) {
      return res.status(400).json({ message: "WooCommerce credentials are missing" });
    }

    console.log("📝 Publishing blog:", blog.title);

    let imageId = null;
    if (blog.imageUrl) {
      try {
        imageId = await uploadImageToWooCommerce({ siteUrl, username, appPassword }, blog.imageUrl);
        console.log("🖼️ Image uploaded with ID:", imageId);
      } catch (err) {
        console.warn("⚠️ Image upload failed, continuing without image:", err.message);
      }
    }

    const postData = {
      title: blog.title,
      content: blog.content,
      status: "publish",
      ...(imageId && { featured_media: imageId }),
    };

    const wooResponse = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, postData, {
      auth: {
        username,
        password: appPassword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Update blog status
    blog.isPublished = true;
    blog.publishedAt = new Date(); // 📅 Optional
    await blog.save();

    console.log(`✅ Blog "${blog.title}" published successfully`);

    res.status(200).json({
      message: "Blog published successfully",
      wooResponse: wooResponse.data,
    });
  } catch (err) {
    console.error("❌ Error publishing blog:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Axios error:", err.message);
    }

    res.status(500).json({ error: "Error publishing blog" });
  }
};


