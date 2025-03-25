// frontend/src/api/blogService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs";

export const getBlogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};
