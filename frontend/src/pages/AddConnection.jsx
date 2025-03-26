import { useState, useEffect } from "react";
import axios from "axios";
import "./AddConnection.css"; // Import the external CSS file

const AddConnection = () => {
  const [connections, setConnections] = useState([]);
  const [formData, setFormData] = useState({
    platform: "WooCommerce",
    siteUrl: "",
    consumerKey: "",
    consumerSecret: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/connections");
      setConnections(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/connections", formData);
      setMessage({ type: "success", text: "Connection added successfully!" });
      fetchConnections();
    } catch (error) {
      console.error("Error adding connection:", error);
      setMessage({ type: "error", text: "Failed to add connection." });
    }
  };

  return (
    <div className="container">
      <h2 className="title">Add Connection</h2>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="siteUrl" placeholder="Site URL" className="input" onChange={handleChange} required />
        <input type="text" name="consumerKey" placeholder="Consumer Key" className="input" onChange={handleChange} required />
        <input type="text" name="consumerSecret" placeholder="Consumer Secret" className="input" onChange={handleChange} required />
        <button type="submit" className="button">Add Connection</button>
      </form>

      <h3 className="sub-title">Existing Connections</h3>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : connections.length > 0 ? (
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
    </div>
  );
};

export default AddConnection;

