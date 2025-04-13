import axios from "axios";

export const postToWooCommerce = async (connection, blog) => {
  try {
    const response = await axios.post(
      `${connection.siteUrl}/wp-json/wp/v2/posts`,
      {
        title: blog.title,
        content: blog.content,
        status: "publish", // Change to "draft" if you want to manually approve
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: connection.consumerKey,
          password: connection.consumerSecret,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Failed to post to WooCommerce:", error.response?.data || error.message);
    throw error;
  }
};

