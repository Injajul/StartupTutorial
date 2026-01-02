
import express from "express";
import {
  createInvestorProfile,
  updateInvestorProfile,
  getInvestorProfileByUserId,
  searchInvestors,
} from "../controllers/investorProfile.controller.js";

import { requireAuth } from "../middlewares/requireAuth.js";
import upload from "../config/multerStorage.js";

const router = express.Router();

/**
 * AUTHENTICATED
 */

// Create profile (with image)
router.post(
  "/create",
  requireAuth,
  upload.single("profileImage"),
  createInvestorProfile
);

// Update profile (with image)
router.put(
  "/update",
  requireAuth,
  upload.single("profileImage"),
  updateInvestorProfile
);



router.get("/search",requireAuth, searchInvestors);
router.get("/:userId", getInvestorProfileByUserId);

export default router;