import express from "express";
import { addConnection, getConnections, updateConnection, deleteConnection } from "../controllers/connectionController.js";

const router = express.Router();

router.post("/", addConnection);
router.get("/", getConnections);
router.put("/:id", updateConnection);
router.delete("/:id", deleteConnection);

export default router;