import MatchRequest from "../models/matchRequest.model.js";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import ChatRoom from "../models/chatRoom.model.js";
/**
 * ----------------------------------------
 * SEND MATCH REQUEST
 * ----------------------------------------
 * Founder → Cofounder
 * Founder → Investor
 */
export const sendMatchRequest = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { toUserId, message = "", matchScore } = req.body;

    if (!toUserId) {
      return res.status(400).json({ message: "Receiver is required" });
    }

    // Sender
    const fromUser = await User.findOne({ clerkId });
    if (!fromUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Receiver
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (fromUser._id.equals(toUser._id)) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    /**
     * ----------------------------------------
     * DETERMINE MATCH TYPE (SINGLE SOURCE)
     * ----------------------------------------
     */
    let type;

    if (fromUser.role === "founder" && toUser.role === "founder") {
      type = "cofounder";
    } else if (fromUser.role === "founder" && toUser.role === "investor") {
      type = "founder-to-investor";
    } else if (fromUser.role === "investor" && toUser.role === "founder") {
      type = "investor-to-founder";
    } else {
      return res.status(400).json({
        message: "Invalid match request roles",
      });
    }

    /**
     * ----------------------------------------
     * PREVENT DUPLICATES
     * ----------------------------------------
     */
    const existing = await MatchRequest.findOne({
      from: fromUser._id,
      to: toUser._id,
      status: "pending",
    });

    if (existing) {
      return res.status(409).json({
        message: "Match request already sent",
      });
    }

    /**
     * ----------------------------------------
     * CREATE REQUEST
     * ----------------------------------------
     */
    const request = await MatchRequest.create({
      from: fromUser._id,
      to: toUser._id,
      type,
      message,
      matchScore,
    });

    // 🔔 Notify receiver
    await Notification.create({
      userId: toUser._id,
      fromUserId: fromUser._id,
      type: "match_request_received",
      entityId: request._id,
      entityType: "MatchRequest",
      message: `${fromUser.fullName} sent you a match request`,
    });

    return res.status(201).json({
      message: "Match request sent",
      request,
    });
  } catch (error) {
    console.error("Send match request error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * GET RECEIVED MATCH REQUESTS
 * ----------------------------------------
 */
export const getIncomingMatchRequests = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await MatchRequest.find({
      to: user._id,
      status: "pending",
    })
      .populate("from", "fullName avatarUrl role")
      .lean();

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get incoming requests error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * GET SENT MATCH REQUESTS
 * ----------------------------------------
 */
export const getSentMatchRequests = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await MatchRequest.find({
      from: user._id,
    })
      .populate("to", "fullName avatarUrl role")
      .lean();

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get sent requests error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * RESPOND TO MATCH REQUEST
 * ----------------------------------------
 * Action: "accept" | "reject"
 */
export const respondToMatchRequest = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { requestId } = req.params;
    const { action } = req.body;

    // 1. Find logged-in user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Find match request
    const request = await MatchRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Match request not found" });
    }

    // 3. Only receiver can respond
    if (request.to.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to respond" });
    }

    // 4. Prevent double responses
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    /* -------------------------------------------------
       REJECT REQUEST
    ------------------------------------------------- */
    if (action === "rejected") {
      request.status = "rejected";
      request.respondedAt = new Date();
      await request.save();

      await Notification.create({
        userId: request.from,
        fromUserId: request.to,
        type: "match_request_rejected",
        entityId: request._id,
        entityType: "MatchRequest",
        message: "Your match request was rejected",
      });

      return res.status(200).json({ message: "Match request rejected" });
    }

    /* -------------------------------------------------
       ACCEPT REQUEST
    ------------------------------------------------- */
    if (action === "accepted") {
      request.status = "accepted";
      request.respondedAt = new Date();
      await request.save();

      // 5. Determine connection type
      let connectionType;
      switch (request.type) {
        case "investor-to-founder":
          connectionType = "investor";
          break;
        case "founder-to-investor":
          connectionType = "investor";
          break;
        case "cofounder":
          connectionType = "cofounder";
          break;
        default:
          throw new Error("Invalid match request type");
      }

      // 6. Create connection
      const connection = await Connection.create({
        participants: [request.from, request.to],
        type: connectionType,
        createdFromRequestId: request._id,
      });

      // 7. Create chat room
      const chatRoom = await ChatRoom.create({
        connectionId: connection._id,
        participants: [request.from, request.to],
        unreadCounts: [
          { userId: request.from, count: 0 },
          { userId: request.to, count: 0 },
        ],
      });

      // 8. 🔥 UPDATE CONNECTION WITH CHAT ROOM ID
      connection.chatRoomId = chatRoom._id;
      await connection.save();

      // 9. Notifications
      await Notification.create({
        userId: request.from,
        fromUserId: request.to,
        type: "match_request_accepted",
        entityId: connection._id,
        entityType: "Connection",
        message: "Your match request was accepted",
      });

      await Notification.create({
        userId: request.to,
        fromUserId: request.from,
        type: "connection_created",
        entityId: connection._id,
        entityType: "Connection",
        message: "You are now connected",
      });

      // 10. Return connection WITH chatRoomId
      return res.status(200).json({
        message: "Match request accepted",
        connection,
      });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error("Respond to match request error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * ----------------------------------------
 * CANCEL MATCH REQUEST (BY SENDER)
 * ----------------------------------------
 */
export const cancelMatchRequest = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { requestId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = await MatchRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.from.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "cancelled";
    request.respondedAt = new Date();
    await request.save();

    res.status(200).json({ message: "Request cancelled" });
  } catch (error) {
    console.error("Cancel request error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};