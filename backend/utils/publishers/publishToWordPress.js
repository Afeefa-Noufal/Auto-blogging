import axios from "axios";

const publishToWordPress = async (blog, connection) => {
  const { siteUrl, username, appPassword } = connection;

  const postData = {
    title: blog.title,
    content: blog.content,
    status: "publish",
  };

  const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, postData, {
    auth: { username, password: appPassword },
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export default publishToWordPress;
