
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

/**
 * ----------------------------------------
 * GET MY NOTIFICATIONS
 * ----------------------------------------
 * Fetch latest notifications for logged-in user
 */
export const getMyNotifications = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = await Notification.find({
      userId: user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * MARK SINGLE NOTIFICATION AS READ
 * ----------------------------------------
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { notificationId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * MARK ALL NOTIFICATIONS AS READ
 * ----------------------------------------
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Notification.updateMany(
      { userId: user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * DELETE A NOTIFICATION
 * ----------------------------------------
 * Optional cleanup action
 */
export const deleteNotification = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { notificationId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};