import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Brands.css"; // Import CSS file for styling

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });

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
      await axios.post("http://localhost:5000/api/brands", newBrand);
      fetchBrands();
      setNewBrand({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  };

  return (
    <div className="brands-container">
      <h2>Manage Brands</h2>

      {/* Add Brand Form */}
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
        <button type="submit">Add Brand</button>
      </form>

      {/* Brand List */}
      {brands.length === 0 ? (
        <p className="no-brands">No brands available.</p>
      ) : (
        <div className="brands-list">
          {brands.map((brand) => (
            <div key={brand._id} className="brand-card">
              <h3>{brand.name}</h3>
              <p>{brand.description}</p>
              <Link to={`/brands/${brand._id}`} className="view-topics">
                View Topics
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;

