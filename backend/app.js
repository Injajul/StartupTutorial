import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Routes
import clerkRoutes from "./routes/clerk.route.js";
import userRoutes from "./routes/user.route.js";
// import founderProfileRoutes from "./routes/founderProfile.routes.js";
// import investorProfileRoutes from "./routes/investorProfile.routes.js";
// import matchRequestRoutes from "./routes/matchRequest.routes.js";
// import connectionRoutes from "./routes/connection.routes.js";
// import chatRoomRoutes from "./routes/chatRoom.routes.js";
// import messageRoutes from "./routes/message.routes.js";
// import notificationRoutes from "./routes/notification.routes.js";
// import recommendationRoutes from "./routes/recommendation.route.js"
const app = express();

/**
 * ----------------------------------------
 * CORS CONFIG
 * ----------------------------------------
 */
const IS_PROD =false;

const allowedOrigins = IS_PROD
  ? "https://startup-tutorial.vercel.app"
  : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/**
 * ----------------------------------------
 * WEBHOOK ROUTE (BEFORE JSON PARSER)
 * ----------------------------------------
 * Clerk requires raw body
 */
app.use("/api/webhook", clerkRoutes);

/**
 * ----------------------------------------
 * MIDDLEWARE
 * ----------------------------------------
 */
app.use(express.json());


/**
 * ----------------------------------------
 * API ROUTES
 * ----------------------------------------
 */
app.use("/api/users", userRoutes);

// app.use("/api/founders", founderProfileRoutes);
// app.use("/api/investors", investorProfileRoutes);

// app.use("/api/match-requests", matchRequestRoutes);
// app.use("/api/connections", connectionRoutes);

// app.use("/api/chat-rooms", chatRoomRoutes);
// app.use("/api/messages", messageRoutes);

// app.use("/api/notifications", notificationRoutes);
// app.use("/api/recommendations", recommendationRoutes);

export default app;