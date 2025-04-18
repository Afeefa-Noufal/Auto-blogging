import axios from "axios";
import uploadImageToWooCommerce from "./uploadImageToWooCommerce.js";

export const postToWooCommerce = async (connection, blog) => {
  try {
    let imageId = null;
    
    console.log("➡ Downloading from:", blog.imageUrl);

    if (!blog.imageUrl) {
      console.warn("⚠ No image URL found in blog");
    }
 
    if (blog.imageUrl) {
      imageId = await uploadImageToWooCommerce(connection, blog.imageUrl);
    }

    const response = await axios.post(
      `${connection.siteUrl}/wp-json/wp/v2/posts`,
      {
        title: blog.title,
        content: blog.content,
        status: "publish",
        ...(imageId && { featured_media: imageId }),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: connection.username,
          password: connection.appPassword, // Instead of consumer key/secret
        },
      }
    );
    

    return response.data;
  } catch (error) {
    console.error("❌ Failed to post to WooCommerce:", error.response?.data || error.message);
    throw error;
  }
};



