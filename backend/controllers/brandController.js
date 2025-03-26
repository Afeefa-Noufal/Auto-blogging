import Brand from "../models/Brand.js";

// Create a new brand
export const createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the brand already exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ error: "Brand already exists" });
    }

    const brand = new Brand({ name, description });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBrandById = async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
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
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a brand
export const updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ error: error.message });
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