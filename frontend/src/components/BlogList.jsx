import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs") // Adjust API URL if needed
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  // Filter blogs based on search input
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="blog-container">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Blog List */}
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
      ) : (
        <p>No matching blogs found.</p>
      )}
    </div>
  );
};

export default BlogList;
