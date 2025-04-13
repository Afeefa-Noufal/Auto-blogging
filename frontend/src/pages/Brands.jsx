import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        // Update Brand
        await axios.put(`http://localhost:5000/api/brands/${editingBrand._id}`, newBrand);
      } else {
        // Create New Brand
        await axios.post("http://localhost:5000/api/brands", newBrand);
      }
      fetchBrands();
      setNewBrand({ name: "", description: "" });
      setEditingBrand(null);
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setNewBrand({ name: brand.name, description: brand.description });
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

      {/* Add / Edit Brand Form */}
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
        <button type="submit">{editingBrand ? "Update Brand" : "Add Brand"}</button>
        {editingBrand && (
          <button type="button" onClick={() => setEditingBrand(null)} className="cancel-edit">
            Cancel
          </button>
        )}
      </form>

      {/* Brand List in Table Format */}
      {brands.length === 0 ? (
        <p className="no-brands">No brands available.</p>
      ) : (
        <table className="brands-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Brand Name</th>
              <th>Description</th>
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

