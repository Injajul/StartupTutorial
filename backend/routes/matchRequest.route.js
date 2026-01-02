import express from "express";
import {
  sendMatchRequest,
  getIncomingMatchRequests,
  getSentMatchRequests,
  respondToMatchRequest,
  cancelMatchRequest,
} from "../controllers/matchRequest.controller.js";

import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

/**
 * ----------------------------------------
 * AUTHENTICATED ROUTES
 * ----------------------------------------
 */

// Send match request (founder → cofounder / investor)
router.post("/send", requireAuth, sendMatchRequest);

// Incoming requests (received by me)
router.get("/incoming", requireAuth, getIncomingMatchRequests);

// Sent requests (sent by me)
router.get("/sent", requireAuth, getSentMatchRequests);

// Respond to request (accept / reject)
router.post("/:requestId/respond", requireAuth, respondToMatchRequest);

// Cancel request (by sender)
router.post("/:requestId/cancel", requireAuth, cancelMatchRequest);

export default router;
