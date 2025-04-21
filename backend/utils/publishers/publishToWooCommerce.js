import axios from "axios";
import uploadImageToWooCommerce from "../uploadImageToWooCommerce.js";

const publishToWooCommerce = async (blog, connection) => {
  const { siteUrl, username, appPassword } = connection;

  let imageId = null;
  if (blog.imageUrl) {
    try {
      imageId = await uploadImageToWooCommerce({ siteUrl, username, appPassword }, blog.imageUrl);
    } catch (err) {
      console.warn("⚠️ WooCommerce image upload failed:", err.message);
    }
  }

  const postData = {
    title: blog.title,
    content: blog.content,
    status: "publish",
    ...(imageId && { featured_media: imageId }),
  };

  const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, postData, {
    auth: { username, password: appPassword },
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export default publishToWooCommerce;
