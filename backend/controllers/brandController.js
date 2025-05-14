import Brand from "../models/Brand.js";
import Connection from "../models/Connection.js";


// Create a new brand
export const createBrand = async (req, res) => {
  try {
    const { name, description, platforms } = req.body;

    // Check if the brand already exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ error: "Brand already exists" });
    }

    // Validate each platform entry
    for (const entry of platforms) {
      const connection = await Connection.findById(entry.connectionId);
      if (!connection) {
        return res.status(400).json({ error: `Connection not found for platform ${entry.platform}` });
      }
      if (connection.platform !== entry.platform) {
        return res.status(400).json({ error: `Connection mismatch: expected ${entry.platform} but got ${connection.platform}` });
      }
    }

    const brand = new Brand({ name, description, platforms });
    await brand.save();

    res.status(201).json(brand);
  } catch (error) {
    console.error("❌ Error creating brand:", error);
    res.status(500).json({ error: "Failed to create brand" });
  }
};

// Get brand by ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate("platforms.connectionId");
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().populate("platforms.connectionId");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a brand
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, platforms } = req.body;

    // Validate each platform entry
    for (const entry of platforms) {
      const connection = await Connection.findById(entry.connectionId);
      if (!connection) {
        return res.status(400).json({ error: `Connection not found for platform ${entry.platform}` });
      }
      if (connection.platform !== entry.platform) {
        return res.status(400).json({ error: `Connection mismatch: expected ${entry.platform} but got ${connection.platform}` });
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description, platforms },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.status(200).json({ message: "Brand updated successfully", brand: updatedBrand });
  } catch (error) {
    console.error("❌ Error updating brand:", error);
    res.status(500).json({ error: "Failed to update brand" });
  }
};


// Delete a brand
export const deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

