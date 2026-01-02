import express from "express";
import {
  createFounderProfile,
  updateFounderProfile,
  searchFounders,
  getFounderProfileByUserId,
  fetchAllFounders,
} from "../controllers/founderProfile.controller.js";

import { requireAuth } from "../middlewares/requireAuth.js";
import upload from "../config/multerStorage.js";

const router = express.Router();

// Create founder profile (with image)
router.post(
  "/",
  requireAuth,
  upload.single("profileImage"),
  createFounderProfile
);

// Update founder profile (reuse same image logic later)
router.put(
  "/",
  requireAuth,
  upload.single("profileImage"),
  updateFounderProfile
);

// Public routes
router.get("/all", fetchAllFounders);
router.get("/search",requireAuth, searchFounders);

// View founder profile by userId
router.get("/:userId", getFounderProfileByUserId);

export default router;