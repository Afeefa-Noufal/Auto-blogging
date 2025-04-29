import { useState, useEffect ,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Topics.css";
import Navbar from "../../components/Navbar";
import { toast} from 'react-toastify';

const Topics = () => {
  const { brandId } = useParams();
  const [topics, setTopics] = useState([]);
  const [brand, setBrand] = useState(null);
  const [newTopic, setNewTopic] = useState({
    title: "",
    status: "active",
    scheduleTime: "",
    imageUrl: ""
  });
  const fileInputRef = useRef(null);


  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();



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
    const { name, value, options } = e.target;
    if (name === "platforms") {
      const selected = Array.from(options).filter((o) => o.selected).map((o) => o.value);
      setNewTopic({ ...newTopic, platforms: selected });
    } else {
      setNewTopic({ ...newTopic, [name]: value });
    }
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

    let imageUrl = imageUrlInput.trim();

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
      toast.success("Topic added successfully!");
      // ✅ Redirect here after success
      navigate(`/brands/${brandId}`);
      

      // (optional) reset form and state
      setNewTopic({ title: "", status: "active", scheduleTime: "", platforms: [] });
      setImageFile(null);
      setImageUrlInput("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchTopics();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add topic.");
    }
  };


  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setNewTopic({
      title: topic.title,
      status: topic.status,
      scheduleTime: topic.scheduleTime ? topic.scheduleTime.slice(0, 16) : "",
      platforms: topic.platforms || [], // ✅ handle existing topics gracefully
    });
    setImageUrlInput(topic.imageUrl || "");
    setImageFile(null);
  };

  const handleUpdate = async () => {
    let imageUrl = imageUrlInput.trim();

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
      await axios.put(`http://localhost:5000/api/topics/${editingTopic._id}`, {
        ...newTopic,
        imageUrl,
        brandId,
      });
      setEditingTopic(null);
      setNewTopic({ title: "", status: "active", scheduleTime: "", platforms: [] });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImageUrlInput("");
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

  const getTopicStatus = (topic) => {
    const now = new Date();
    if (topic.used) return "completed"; // correct field name
    if (topic.failed) return "failed";
    if (topic.scheduleTime && new Date(topic.scheduleTime) > now) return "scheduled";
    return topic.status || "active";
  };
  

  return (
    <div className="topics-container">
      <Navbar/>
      <h2>{brand ? `${brand.name} - Topics` : "Loading..."}</h2>
      <p>{brand?.description}</p>

      {error && <p className="error-message">{error}</p>}
      <form onSubmit={editingTopic ? handleUpdate : handleSubmit} className="topics-form-container">
        <div className="form-section">
          <input
            type="text"
            name="title"
            placeholder="Topic Name"
            value={newTopic.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <select name="status" value={newTopic.status} onChange={handleChange}>
            <option value="" disabled> Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="form-section">
          <input
            type="datetime-local"
            name="scheduleTime"
            value={newTopic.scheduleTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="upload image"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {(imageUrlInput || imageFile) && (
            <div className="image-preview">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageUrlInput}
                alt="Preview"
                className="topic-image"
              />
            </div>
          )}
        </div>


        <div className="form-button-section">
          <button type="submit" className="primary-btn">
            {editingTopic ? "Update Topic" : "Add Topic"}
          </button>
        </div>
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
              <th>Schedule Time</th>
              <th>Image</th>
              <th>Platforms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic._id}>
                <td>{topic.title}</td>
                <td><span className={`status-badge ${getTopicStatus(topic)}`}>
                  {getTopicStatus(topic)}
                </span></td>

                <td>
                  {topic.scheduleTime
                    ? new Date(topic.scheduleTime).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {topic.imageUrl ? (
                    <img src={topic.imageUrl} alt={topic.title} className="topic-image" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {/* {topic.platforms && topic.platforms.length > 0
                    ? topic.platforms.join(", ")
                    : "None"} */}
                  {topic.platforms.map(p => (
                    <div key={p.connectionId}>
                      {p.platform}
                      {/* , Connection ID: {p.connectionId}  */}
                    </div>
                  ))}

                </td>
                <td>
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



