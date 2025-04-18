import express from "express";
import { createTopic, getTopics, updateTopic, deleteTopic, getTopicsByBrand,} from "../controllers/topicController.js";

const router = express.Router();

router.post("/", createTopic); // Add a new topic
router.get("/", getTopics); // Get all topics
router.get("/brand/:brandId", getTopicsByBrand); // Get topics by brand
router.put("/:id", updateTopic); // Update a topic
router.delete("/:id", deleteTopic); // Delete a topic

export default router;

