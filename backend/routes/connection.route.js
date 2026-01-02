import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import {
  getMyConnections,
  getConnectionById,
} from "../controllers/connection.controller.js";

const router = express.Router();

// List my connections
router.get("/", requireAuth, getMyConnections);

// Get single connection
router.get("/:connectionId", requireAuth, getConnectionById);

export default router;