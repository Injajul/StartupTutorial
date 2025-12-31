import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/connectDB.js";
import app from "./app.js";
// import { initSocketServer } from "./config/socket.js";

dotenv.config();

/**
 * ----------------------------------------
 * DATABASE
 * ----------------------------------------
 */
connectDB();

/**
 * ----------------------------------------
 * SERVER
 * ----------------------------------------
 */
const server = http.createServer(app);

/**
 * ----------------------------------------
 * SOCKET.IO
 * ----------------------------------------
 */
// initSocketServer(server);

/**
 * ----------------------------------------
 * START SERVER
 * ----------------------------------------
 */
const PORT = process.env.PORT || 5004;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 WebSocket initialized`);
});