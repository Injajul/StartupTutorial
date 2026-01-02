import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import { recommendFounders, recommendInvestors } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get(
  "/founders",
  requireAuth,
  recommendFounders
);

router.get("/investors", requireAuth, recommendInvestors);

export default router;