
import express from "express"

import {getCurrentContext} from "../controllers/user.controller.js"
import {requireAuth} from "../middlewares/requireAuth.js"

const router = express.Router()

router.get("/me", requireAuth, getCurrentContext)

export default router