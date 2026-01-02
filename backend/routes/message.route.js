import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import {
  sendMessage,
  getMessagesByRoom,
} from "../controllers/message.controller.js";
import upload from "../config/multerStorage.js";
const router = express.Router();


// Send a message in a chat room
router.post(
  "/",
  requireAuth,
  upload.array("attachments", 5), // 👈 multi-file support
  sendMessage
);


// Get all messages of a specific chat room
router.get("/:roomId", requireAuth, getMessagesByRoom);

export default router;