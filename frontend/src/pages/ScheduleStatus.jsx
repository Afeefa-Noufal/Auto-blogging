import React, { useEffect, useState } from "react";
import axios from "axios";
import './ScheduleStatus.css'

const ScheduleStatus = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch topics from API
  useEffect(() => {
    const fetchScheduleStatus = async () => {
      try {
        const res = await axios.get("/api/schedule-status");
        if (Array.isArray(res.data)) {
          setTopics(res.data);
        } else {
          console.warn("Expected array but got:", res.data);
          setTopics([]);
        }
      } catch (err) {
        console.error("Error fetching schedule status:", err.message);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleStatus();
  }, []);

  // Search filter logic
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered topics based on search query
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="schedule-status-page">
      <h2>Schedule Status</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Blog Title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredTopics.length === 0 ? (
        <p>No scheduled topics found.</p>
      ) : (
        <table className="status-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Schedule Time</th>
              <th>Platforms</th>
              <th>Brand Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTopics.map((topic) => (
              <tr key={topic.topicId}>
                <td>{topic.title}</td>
                <td>
                  {topic.scheduleTime
                    ? new Date(topic.scheduleTime).toLocaleString()
                    : "Not scheduled"}
                </td>
                <td>
                  {topic.platforms?.map((p, i) => (
                    <span key={i}>
                      {p.platform}
                      {i < topic.platforms.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </td>
                <td>{topic.brandName || "Unknown"}</td>
                <td>{topic.blogStatus || "Not scheduled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScheduleStatus;





