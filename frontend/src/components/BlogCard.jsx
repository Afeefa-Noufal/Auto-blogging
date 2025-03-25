import { useState } from "react";

const BlogCard = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);
  const previewLength = 200; // Number of characters before showing "Read More"

  return (
    <div style={styles.card}>
      {/* Show blog image if available */}
      {blog.imageUrl && (
        <img src={blog.imageUrl} alt={blog.title} style={styles.image} />
      )}


      <h2 style={styles.title}>{blog.title}</h2>

      <p style={styles.content}>
        {expanded ? blog.content : `${blog.content.substring(0, previewLength)}...`}
      </p>

      <button onClick={() => setExpanded(!expanded)} style={styles.button}>
        {expanded ? "Read Less" : "Read More"}
      </button>

      <small style={styles.date}>
        Published: {new Date(blog.publishedAt).toLocaleString()}
      </small>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "16px",
    margin: "16px 0",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    maxWidth: "700px", // Ensuring a good layout for blog cards
  },
  image: {
    width: "70%", // Full width of the card
    height: "300px", // Fixed height
    // objectFit: "cover", // Ensures the image is properly contained
    borderRadius: "5px",
    marginBottom: "10px",
    marginTop:"20px",
    marginLeft:"15%"
  },
  title: {
    marginBottom: "10px",
  },
  content: {
    fontSize: "16px",
    color: "#333",
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    border: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
  date: {
    display: "block",
    marginTop: "10px",
    color: "#777",
  },
};

export default BlogCard;








