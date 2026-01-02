import ChatRoom from "../models/chatRoom.model.js";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

/**
 * ----------------------------------------
 * CREATE CHAT ROOM FROM CONNECTION
 * ----------------------------------------
 * Called once after a connection is created
 */
export const createChatRoom = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { connectionId } = req.body;

    // 1. Find authenticated user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find connection
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // 3. Authorization: user must be part of connection
    if (!connection.participants.some((id) => id.equals(user._id))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 4. If chat room already exists → return it
    if (connection.chatRoomId) {
      const existingRoom = await ChatRoom.findById(connection.chatRoomId);
      if (existingRoom) {
        return res.status(200).json(existingRoom);
      }
    }

    // 5. Create chat room
    const chatRoom = await ChatRoom.create({
      connectionId: connection._id,
      participants: connection.participants,
      unreadCounts: connection.participants.map((id) => ({
        userId: id,
        count: 0,
      })),
    });

    // 6. 🔥 UPDATE CONNECTION WITH CHAT ROOM ID
    connection.chatRoomId = chatRoom._id;
    await connection.save();

    return res.status(201).json(chatRoom);
  } catch (error) {
    console.error("Create chat room error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * GET MY CHAT ROOMS
 * ----------------------------------------
 */
export const getMyChatRooms = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rooms = await ChatRoom.find({
      participants: user._id,
      isActive: true,
    })
      .populate("participants", "fullName avatarUrl role")
      .sort({ lastMessageAt: -1 })
      .lean();

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Get chat rooms error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const archiveChatRoom = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { roomId } = req.params;

    // Find authenticated user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    // Authorization: user must be a participant
    const isParticipant = chatRoom.participants.some(
      (id) => id.toString() === user._id.toString()
    );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to archive this room" });
    }

    // Soft archive
    chatRoom.isActive = false;
    await chatRoom.save();

    res.status(200).json({
      message: "Chat room archived successfully",
      roomId: chatRoom._id,
    });
  } catch (error) {
    console.error("Archive chat room error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};