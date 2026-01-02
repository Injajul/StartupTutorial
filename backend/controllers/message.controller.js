import Message from "../models/message.model.js";
import ChatRoom from "../models/chatRoom.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { getIO } from "../config/socket.js";
import uploadToCloudinary from "../helpers/uploadToCloudinary.js";
/**
 * ----------------------------------------
 * SEND MESSAGE
 * ----------------------------------------
 */
export const sendMessage = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { roomId, body = "" } = req.body;

    // Find sender
    const sender = await User.findOne({ clerkId });
    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate chat room
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    // Authorization check
    if (!room.participants.includes(sender._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Identify receiver
    const receiverId = room.participants.find(
      (id) => id.toString() !== sender._id.toString()
    );

    /* ----------------------------------------
       HANDLE ATTACHMENTS (ANY MIME TYPE)
    ---------------------------------------- */
    let attachments = [];

    if (req.files && req.files.length > 0) {
      attachments = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await uploadToCloudinary(file.path, {
            folder: "chat/attachments",
            resource_type: "auto", // 👈 images, videos, pdf, audio, docs
          });

          return {
            file: {
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
            },
            mimeType: file.mimetype,
            meta: {
              originalName: file.originalname,
              size: file.size,
            },
          };
        })
      );
    }

    // Persist message
    const message = await Message.create({
      roomId,
      from: sender._id,
      to: receiverId,
      body,
      attachments,
    });

    // Update chat room metadata
    room.lastMessageAt = new Date();
    room.lastMessageId = message._id;

    room.unreadCounts = room.unreadCounts.map((u) =>
      u.userId.toString() === receiverId.toString()
        ? { ...u, count: u.count + 1 }
        : u
    );

    await room.save();

    // Notification
    await Notification.create({
      userId: receiverId,
      fromUserId: sender._id,
      type: "new_message",
      entityId: message._id,
      entityType: "Message",
      message: `${sender.fullName} sent you a message`,
    });

    // Socket emit
    const io = getIO();
    io.to(roomId.toString()).emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



/**
 * ----------------------------------------
 * GET MESSAGES BY ROOM
 * ----------------------------------------
 */
export const getMessagesByRoom = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { roomId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    if (!room.participants.includes(user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};