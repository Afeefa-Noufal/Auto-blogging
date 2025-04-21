import express from "express";
import { getScheduledStatuses } from "../controllers/scheduleStatusController.js";

const router = express.Router();

// GET /api/schedule-status
router.get("/", getScheduledStatuses);

export default router;
