import { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import "./Blogs.css"; // Import CSS file for styling

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blogs-container">
      <h1>Latest Blogs</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Blog List */}
      <div className="blog-list">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <p className="no-blogs">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Blogs;





