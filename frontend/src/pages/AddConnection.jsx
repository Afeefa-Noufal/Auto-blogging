import { useState, useEffect } from "react";
import axios from "axios";
import "./AddConnection.css"; // Import the external CSS file

const AddConnection = () => {
  const [connections, setConnections] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [formData, setFormData] = useState({
    platform: "WooCommerce",
    siteUrl: "",
    consumerKey: "",
    consumerSecret: "",
    isActive: true,
    brandId: "", // Still needed when adding a connection
  });

  useEffect(() => {
    const brandId = localStorage.getItem("brandId");
    setFormData((prev) => ({ ...prev, brandId }));
    fetchConnections();
    fetchBlogs();
  }, []);

  // Fetch WooCommerce connections
  const fetchConnections = async () => {
    try {
      console.log("Fetching connections...");
      const response = await axios.get("http://localhost:5000/api/connections");
      console.log("Received connections:", response.data);
      if (Array.isArray(response.data)) {
        setConnections(response.data);
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      console.log("Fetching blogs...");
      const response = await axios.get("http://localhost:5000/api/blogs");
      console.log("Received blogs:", response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Publish blog
  const publishToWooCommerce = async () => {
    if (!selectedBlogId) {
      alert("Please select a blog to publish.");
      return;
    }

    try {
      console.log(`Publishing blog ID: ${selectedBlogId}`);
      await axios.post(`http://localhost:5000/api/blogs/${selectedBlogId}/publish`);
      alert("Blog posted to WooCommerce successfully!");
    } catch (error) {
      console.error("Error publishing blog:", error);
      if (error.response) {
        console.error("Response error:", error.response);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      alert("Failed to post blog to WooCommerce");
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new connection
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending request to API...");
      const response = await axios.post("http://localhost:5000/api/connections", formData);
      console.log("✅ Connection added:", response.data);
      alert("Connection added successfully");
      fetchConnections();
    } catch (error) {
      console.error("❌ Error adding connection:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Add Connection</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="siteUrl"
          placeholder="Site URL"
          className="input"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="consumerKey"
          placeholder="Consumer Key"
          className="input"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="consumerSecret"
          placeholder="Consumer Secret"
          className="input"
          onChange={handleChange}
          required
        />
        <button type="submit" className="button">Add Connection</button>
      </form>

      <h3 className="sub-title">Existing Connections</h3>
      {connections.length > 0 ? (
        <ul className="connection-list">
          {connections.map((conn) => (
            <li key={conn._id} className="connection-item">
              <div>
                <span className="platform">{conn.platform}</span> - <span className="site-url">{conn.siteUrl}</span>
              </div>
              <span className={`status ${conn.isActive ? "active" : "inactive"}`}>
                {conn.isActive ? "Active" : "Inactive"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-connections">No connections found.</p>
      )}

      {connections.length > 0 && (
        <>
          <h3 className="sub-title">Publish Blog to WooCommerce</h3>
          <select
            className="dropdown"
            value={selectedBlogId}
            onChange={(e) => setSelectedBlogId(e.target.value)}
          >
            <option value="">Select a blog</option>
            {blogs.map((blog) => (
              <option key={blog._id} value={blog._id}>
                {blog.title}
              </option>
            ))}
          </select>

          <button onClick={publishToWooCommerce} className="button">
            Publish to WooCommerce
          </button>
        </>
      )}
    </div>
  );
};

export default AddConnection;


