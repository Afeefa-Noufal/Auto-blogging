import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Brands.css";

const platformOptions = ["WooCommerce", "Shopify", "Medium", "WordPress"];

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", description: "", platforms: [] });
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleChange = (e) => {
    setNewBrand({ ...newBrand, [e.target.name]: e.target.value });
  };

  const handlePlatformToggle = (platform) => {
    const existing = newBrand.platforms.find(p => p.platform === platform);

    let updatedPlatforms;
    if (existing) {
      updatedPlatforms = newBrand.platforms.filter(p => p.platform !== platform);
    } else {
      updatedPlatforms = [...newBrand.platforms, { platform }];
    }

    setNewBrand({ ...newBrand, platforms: updatedPlatforms });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the platforms array from newBrand
      const brandData = { ...newBrand };

      if (editingBrand) {
        // Update Brand
        await axios.put(`http://localhost:5000/api/brands/${editingBrand._id}`, brandData);
      } else {
        // Create New Brand
        await axios.post("http://localhost:5000/api/brands", brandData);
      }

      fetchBrands();
      setNewBrand({ name: "", description: "", platforms: [] });
      setEditingBrand(null);
    } catch (error) {
      console.error("Error saving brand:", error.response ? error.response.data : error.message);
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
      } catch (error) {
        console.error("Error deleting brand:", error);
      }
    }
  };

  return (
    <div className="brands-container">
      <h2>Manage Brands</h2>

      <form onSubmit={handleSubmit} className="brand-form">
        <input
          type="text"
          name="name"
          placeholder="Brand Name"
          value={newBrand.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newBrand.description}
          onChange={handleChange}
        />

        <div className="platforms-selection">
          <label>Select Platforms:</label>
          <div className="checkbox-group">
            {platformOptions.map((platform) => (
              <label key={platform} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={newBrand.platforms.some(p => p.platform === platform)}
                  onChange={() => handlePlatformToggle(platform)}
                />
                {platform}
              </label>
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
              <th>Platforms</th> {/* New column for platforms */}
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
                  {/* Display platforms for each brand */}
                  {brand.platforms.map((platform, idx) => (
                    <span key={idx}>{platform.platform}{idx < brand.platforms.length - 1 ? ', ' : ''}</span>
                  ))}
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




