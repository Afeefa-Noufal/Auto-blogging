import axios from "axios";
import FormData from "form-data";

const uploadImageToWooCommerce = async (connection, imageUrl) => {
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    console.log("✅ Image downloaded successfully from:", imageUrl);

    const form = new FormData();
    form.append("file", Buffer.from(imageResponse.data), "blog-image.jpg");

    const uploadRes = await axios.post(
      `${connection.siteUrl}/wp-json/wp/v2/media`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        auth: {
          username: connection.username || connection.consumerKey,
          password: connection.appPassword || connection.consumerSecret,
        },
      }
    );

    const imageId = uploadRes.data.id;
    console.log("✅ Image uploaded to WooCommerce. Media ID:", imageId);
    return imageId;

  } catch (uploadErr) {
    console.error("❌ Upload Error:");
    if (uploadErr.response) {
      console.error("Status:", uploadErr.response.status);
      console.error("Data:", uploadErr.response.data);
    } else if (uploadErr.request) {
      console.error("No response received:", uploadErr.request);
    } else {
      console.error("Error:", uploadErr.message);
    }
    return null; // fallback
  }
};

export default uploadImageToWooCommerce;

