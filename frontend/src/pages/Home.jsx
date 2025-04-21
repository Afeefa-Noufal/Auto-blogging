import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to AutoBlog</h1>
      <p style={styles.description}>
        Automatically generated blogs using AI. Stay updated with fresh content daily!
      </p>
      <Link to="/blogs" style={styles.button}>
        View Blogs
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    background: "linear-gradient(to right, #007bff, #0056b3)",
    color: "#fff",
    height: "100vh", // Full screen height
    width: "100vw",  // Full width
    position: "fixed", // Makes sure it starts from the top
    top: "0", 
    left: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  description: {
    fontSize: "1.2rem",
    maxWidth: "600px",
    lineHeight: "1.6",
    marginBottom: "30px",
    color:"white"
  },
  button: {
    padding: "12px 24px",
    background: "#ffcc00",
    color: "#333",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
};

export default Home;





