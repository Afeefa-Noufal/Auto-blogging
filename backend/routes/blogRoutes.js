// backend/routes/blogRoutes.js
import express from "express";
import { createBlog, getAllBlogs } from "../controllers/blogController.js";


const router = express.Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);

export default router;