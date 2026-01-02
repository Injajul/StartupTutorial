import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  createChatRoom,
  getMyChatRooms,
} from "../controllers/chatRoom.controller.js";

const router = express.Router();

// Called after a match request is accepted
router.post("/", requireAuth, createChatRoom);

// Get all chat rooms of the logged-in user
router.get("/", requireAuth, getMyChatRooms);

export default router;
