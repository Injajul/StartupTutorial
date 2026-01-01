import express from "express";

import { verifyClerkWebhook } from "../middlewares/verifyClerkWebhook.js";
import { handleClerkWebhook } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  verifyClerkWebhook,
  handleClerkWebhook
);

export default router