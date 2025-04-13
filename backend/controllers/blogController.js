import Blog from "../models/Blog.js";
import { generateDetailedReview } from "../utils/openaiHelper.js";
import dotenv from "dotenv";
import getConnectionByPlatform from "../helpers/getConnectionByPlatform.js";
import axios from "axios";

dotenv.config();

export const createBlog = async (req, res) => {
  try {
    const { title, brand } = req.body;

    if (!title || !brand) {
      return res.status(400).json({ message: "Title and brand are required" });
    }

    const content = await generateDetailedReview(title);

    const newBlog = new Blog({
      title,
      content,
      brand,
      publishedAt: new Date(),
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
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

    // Fetch the blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("📄 Publishing blog ID:", blog._id);

    // Fetch WooCommerce connection
    const connection = await getConnectionByPlatform("WooCommerce");

    if (!connection) {
      return res.status(404).json({
        message: "No WooCommerce connection found",
      });
    }

    const { siteUrl, username, appPassword } = connection;

    if (!username || !appPassword) {
      return res.status(400).json({
        message: "WooCommerce credentials are missing",
      });
    }

    console.log("📝 Publishing blog:", blog.title);

    // Post the blog to WooCommerce
    const wooResponse = await axios.post(
      `${siteUrl}/wp-json/wp/v2/posts`,
      {
        title: blog.title,
        content: blog.content,
        status: "publish",
      },
      {
        auth: {
          username,
          password: appPassword, // Use app password instead of consumerKey and secret
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
  }
};


