import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Topics.css";

const Topics = () => {
  const { brandId } = useParams();
  const [topics, setTopics] = useState([]);
  const [brand, setBrand] = useState(null);
  const [newTopic, setNewTopic] = useState({ title: "", status: "active" });
  const [imageFile, setImageFile] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (brandId) {
      fetchBrandDetails();
      fetchTopics();
    }
  }, [brandId]);

  const fetchBrandDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/brands/${brandId}`);
      setBrand(response.data);
    } catch (error) {
      console.error("Error fetching brand details:", error);
      setError("Failed to load brand details.");
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/topics/brand/${brandId}`);
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error.response?.data || error.message);
      setError("Failed to load topics.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewTopic({ ...newTopic, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTopic.title.trim()) {
      setError("Topic title is required.");
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.imageUrl;
      } catch (uploadError) {
        setError("Failed to upload image.");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/topics", {
        ...newTopic,
        imageUrl,
        brandId,
      });
      fetchTopics();
      setNewTopic({ title: "", status: "active" });
      setImageFile(null);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add topic.");
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setNewTopic({ title: topic.title, status: topic.status });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/topics/${editingTopic._id}`, {
        ...newTopic,
        brandId,
      });
      setEditingTopic(null);
      setNewTopic({ title: "", status: "active" });
      fetchTopics();
    } catch (error) {
      setError("Failed to update topic.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/topics/${id}`);
      fetchTopics();
    } catch (error) {
      setError("Failed to delete topic.");
    }
  };

  return (
    <div className="topics-container">
      <h2>{brand ? `${brand.name} - Topics` : "Loading..."}</h2>
      <p>{brand?.description}</p>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={editingTopic ? handleUpdate : handleSubmit} className="topics-form">
        <input
          type="text"
          name="title"
          placeholder="Topic Title"
          value={newTopic.title}
          onChange={handleChange}
          required
        />
        <select name="status" value={newTopic.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">{editingTopic ? "Update Topic" : "Add Topic"}</button>
      </form>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <p>No topics available for this brand.</p>
      ) : (
        <table className="topics-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic._id}>
                <td>{topic.title}</td>
                <td>{topic.status}</td>
                <td>
                  {topic.imageUrl ? <img src={topic.imageUrl} alt={topic.title} className="topic-image" /> : "No Image"}
                </td>
                <td >
                  <button className="edit-btn" onClick={() => handleEdit(topic)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(topic._id)}>Delete</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Topics;

