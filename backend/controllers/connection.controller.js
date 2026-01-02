import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

/**
 * ----------------------------------------
 * GET MY CONNECTIONS
 * ----------------------------------------
 */
export const getMyConnections = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await Connection.find({
      participants: user._id,
    })
      .populate("participants", "fullName avatarUrl role")
      .sort({ lastInteractionAt: -1 })
      .lean();

    res.status(200).json(connections);
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * GET SINGLE CONNECTION
 * ----------------------------------------
 */
export const getConnectionById = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connection = await Connection.findById(connectionId)
      .populate("participants", "fullName avatarUrl role")
      .lean();

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (!connection.participants.some(p => p._id.toString() === user._id.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(connection);
  } catch (error) {
    console.error("Get connection error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};