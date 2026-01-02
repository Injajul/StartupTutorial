import express from "express";
import {requireAuth} from "../middlewares/requireAuth.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

/**
 * ----------------------------------------
 * NOTIFICATION ROUTES
 * ----------------------------------------
 */

// Get my notifications
router.get("/", requireAuth, getMyNotifications);

// Mark one notification as read
router.patch("/:notificationId/read", requireAuth, markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", requireAuth, markAllNotificationsAsRead);

// Delete a notification
router.delete("/:notificationId", requireAuth, deleteNotification);

export default router;