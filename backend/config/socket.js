import { Server } from "socket.io";

let io;

// userId → socketId
const onlineUsers = new Map();

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;

    if (!userId) {
      socket.disconnect();
      return;
    }

    console.log("✅ User connected:", userId);

    // Track online user
    onlineUsers.set(userId, socket.id);

    // Personal room (notifications, direct emits)
    socket.join(userId);

    // Broadcast online users
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    /**
     * ----------------------------------------
     * JOIN CHAT ROOM
     * ----------------------------------------
     */
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    /**
     * ----------------------------------------
     * LEAVE CHAT ROOM
     * ----------------------------------------
     */
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
    });

    /**
     * ----------------------------------------
     * DISCONNECT
     * ----------------------------------------
     */
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", userId);
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

export const getIO = () => io;

export const isUserOnline = (userId) => onlineUsers.has(userId);