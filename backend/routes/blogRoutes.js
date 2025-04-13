// backend/routes/blogRoutes.js
import express from "express";
import { createBlog, getAllBlogs ,  publishBlog } from "../controllers/blogController.js";


const router = express.Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.post("/:id/publish", publishBlog); 


export default router;
