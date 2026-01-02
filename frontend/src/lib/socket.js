// src/lib/socket.js  (or config/socket.js)
import { io } from "socket.io-client";
import { API_BASE_URL } from "../redux/apiUrl";

let socket = null;

export const getSocket = (clerkUserId) => {
  if (!socket || !socket.connected) {
    socket = io(API_BASE_URL.replace("/api", ""), {
      withCredentials: true,
      transports: ["websocket", "polling"],
      query: clerkUserId ? { userId: clerkUserId } : {},
      reconnection: true,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

// Optional: disconnect on logout
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};