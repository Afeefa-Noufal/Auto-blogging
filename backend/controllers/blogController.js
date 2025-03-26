import Blog from "../models/Blog.js";
import Connection from "../models/Connection.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate a human-like review
export const generateReview = async (title) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Write a well-crafted, engaging blog review on "${title}".  
          - Start with an attention-grabbing introduction.  
          - Provide insightful details in a structured format.  
          - Keep paragraphs conversational, flowing naturally.  
          - Avoid robotic formatting (e.g., **B##, excessive bullet points).  
          - Ensure a smooth and compelling conclusion that encourages reader engagement.`
        },
      ],
      max_tokens: 400,
    });

    let blogContent = response.choices[0].message.content.trim();

    blogContent = blogContent
      .replace(/\*\*/g, "")
      .replace(/#/g, "")
      .replace(/\n{2,}/g, "\n\n")
      .replace(/- /g, "• "); 

    return blogContent;
  } catch (error) {
    console.error("Error generating review:", error);
    return "We encountered an issue generating the article. Please try again later.";
  }
};

// Function to post the blog to WooCommerce
const postToWooCommerce = async (blog) => {
  try {
    const connection = await Connection.findOne({ platform: "WooCommerce", isActive: true });

    if (!connection) {
      console.log("No active WooCommerce connection found.");
      return;
    }

    const { siteUrl, consumerKey, consumerSecret } = connection;
    const url = `${siteUrl}/wp-json/wp/v2/posts`;

    const response = await axios.post(
      url,
      {
        title: blog.title,
        content: blog.content,
        status: "publish", // Automatically publish the blog
      },
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );

    console.log("Blog successfully posted to WooCommerce:", response.data);
  } catch (error) {
    console.error("Failed to post blog to WooCommerce:", error.response?.data || error.message);
  }
};

// Create a blog with a generated review and post it to WooCommerce
export const createBlog = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const content = await generateReview(title);

    const newBlog = new Blog({
      title,
      content,
      publishedAt: new Date(),
    });

    await newBlog.save();

    // ✅ Automatically post to WooCommerce
    await postToWooCommerce(newBlog);

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


// import Blog from "../models/Blog.js";
// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Generate a human-like review
// export const generateReview = async (title) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `Write a well-crafted, engaging blog review on "${title}".  
//           - Start with an attention-grabbing introduction.  
//           - Provide insightful details in a structured format.  
//           - Keep paragraphs conversational, flowing naturally.  
//           - Avoid robotic formatting (e.g., **B##, excessive bullet points).  
//           - Ensure a smooth and compelling conclusion that encourages reader engagement.`
//         },
//       ],
//       max_tokens: 400, // Allows for a more detailed yet concise review
//     });

//     let blogContent = response.choices[0].message.content.trim();

//     // Formatting cleanup to ensure human-like readability
//     blogContent = blogContent
//       .replace(/\*\*/g, "") // Remove unnecessary bold markers
//       .replace(/#/g, "") // Eliminate AI-generated hashtags
//       .replace(/\n{2,}/g, "\n\n") // Maintain natural paragraph spacing
//       .replace(/- /g, "• "); // Convert dashes to bullet points only when necessary

//     return blogContent;
//   } catch (error) {
//     console.error("Error generating review:", error);
//     return "We encountered an issue generating the article. Please try again later.";
//   }
// };





// // Create a blog with a generated review
// export const createBlog = async (req, res) => {
//   try {
//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: "Title is required" });
//     }

//     // ✅ Use generateReview instead of generateDetailedReview
//     const content = await generateReview(title);

//     // Create a new blog entry
//     const newBlog = new Blog({
//       title,
//       content,
//       publishedAt: new Date(),
//     });

//     await newBlog.save();
//     res.status(201).json(newBlog);
//   } catch (error) {
//     console.error("Error creating blog:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get all blogs
// export const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     res.json(blogs);
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
