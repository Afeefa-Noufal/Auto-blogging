import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/Brands.css";
import Navbar from "../../components/Navbar";
import { toast } from 'react-toastify';

const platformOptions = ["WooCommerce", "Shopify", "Medium", "WordPress"];

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", description: "", platforms: [] });
  const [editingBrand, setEditingBrand] = useState(null);
  const [connections, setConnections] = useState([]);


  useEffect(() => {
    fetchBrands();
    fetchConnections();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };


  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/connections");
      setConnections(res.data);
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  };


  const handleChange = (e) => {
    setNewBrand({ ...newBrand, [e.target.name]: e.target.value });
  };

  const handlePlatformConnectionChange = (platform, connectionId) => {
    const updatedPlatforms = newBrand.platforms.filter(p => p.platform !== platform);
    if (connectionId) {
      updatedPlatforms.push({ platform, connectionId });
    }
    setNewBrand({ ...newBrand, platforms: updatedPlatforms });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const brandData = { ...newBrand };

      if (editingBrand) {
        // Update Brand
        await axios.put(`http://localhost:5000/api/brands/${editingBrand._id}`, brandData);
        toast.success("Brand updated successfully!");
      } else {
        // Create New Brand
        await axios.post("http://localhost:5000/api/brands", brandData);
        toast.success("Brand added successfully!");
      }

      fetchBrands();
      setNewBrand({ name: "", description: "", platforms: [] });
      setEditingBrand(null);
    } catch (error) {
      console.error("Error saving brand:", error.response ? error.response.data : error.message);
      toast.error("Failed to save brand!");
    }
  };

  const handleEdit = (brand) => {
    setNewBrand({
      name: brand.name,
      description: brand.description,
      platforms: brand.platforms || []
    });
    setEditingBrand(brand);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await axios.delete(`http://localhost:5000/api/brands/${id}`);
        fetchBrands();
        toast.success("Brand deleted successfully!"); // ✅ Toast on delete success
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand!"); // ✅ Toast on delete error
      }
    }
  };

  return (
    <div className="brands-container">
      <Navbar />
      <h2>Manage Brands</h2>

      <form onSubmit={handleSubmit} className="brand-form">
        
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Brand Name"
            value={newBrand.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newBrand.description}
            onChange={handleChange}
          />
        </div>

        <div className="platforms-selection">
          <label>Select Platforms:</label>
          <div className="checkbox-group">
            {platformOptions.map((platform) => (
              <div key={platform} className="connection-selection">
                <label>{platform}</label>
                <select
                  value={
                    newBrand.platforms.find(p => p.platform === platform)?.connectionId || ""
                  }
                  onChange={(e) => handlePlatformConnectionChange(platform, e.target.value)}
                >
                  <option value="">Select Connection</option>
                  {connections
                    .filter(conn => conn.platform === platform)
                    .map(conn => (
                      <option key={conn._id} value={conn._id}>
                        {conn.siteUrl}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">{editingBrand ? "Update Brand" : "Add Brand"}</button>
        {editingBrand && (
          <button type="button" onClick={() => setEditingBrand(null)} className="cancel-edit">
            Cancel
          </button>
        )}
      </form>


      {brands.length === 0 ? (
        <p className="no-brands">No brands available.</p>
      ) : (
        <table className="brands-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Brand Name</th>
              <th>Description</th>
              <th>Platforms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand._id}>
                <td>{index + 1}</td>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>
                  {brand.platforms.map((platform, idx) => {
                    console.log("Platform: ", platform); // Log the platform data
                    console.log("Available connections: ", connections); // Log all available connections

                    // Log connectionId to verify it's set correctly
                    console.log("Connection ID for this platform: ", platform.connectionId);

                    // Ensure connectionId is an actual string and not an object
                    const connectionId = platform.connectionId ? platform.connectionId._id || platform.connectionId : null;

                    if (!connectionId) {
                      console.log("No connectionId for platform", platform.platform);
                    }

                    const conn = connections.find(c => {
                      console.log("Checking connection: ", c); // Log each connection
                      return c._id && connectionId && c._id.toString() === connectionId.toString();
                    });

                    console.log("Found connection: ", conn); // Log the found connection (or undefined)

                    return (
                      <span key={idx}>
                        {platform.platform}: {conn ? conn.siteUrl : 'No connection'}
                        {idx < brand.platforms.length - 1 ? ', ' : ''}
                      </span>
                    );
                  })}
                </td>


                <td>
                  <Link to={`/brands/${brand._id}`} className="view-topics">View Topics</Link>
                  <button onClick={() => handleEdit(brand)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(brand._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Brands;





