import express from "express";
import {
  createBrand,
  getBrands,
  getBrandById,  // ✅ Add this controller function
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";

const router = express.Router();

router.post("/", createBrand); // Add a new brand
router.get("/", getBrands); // Get all brands
router.get("/:id", getBrandById); // ✅ Fetch brand by ID
router.put("/:id", updateBrand); // Update brand details
router.delete("/:id", deleteBrand); // Delete a brand

export default router;

