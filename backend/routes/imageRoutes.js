import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Save with original extension
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  console.log("Image URL:", imageUrl); // Debugging
  res.json({ imageUrl }); // ✅ Ensure this response is correct
});

export default router;

