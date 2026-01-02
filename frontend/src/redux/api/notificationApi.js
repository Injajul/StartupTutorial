import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Get my notifications
export const getMyNotificationsAPI = (token) =>
  api.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Mark single notification as read
export const markNotificationAsReadAPI = (notificationId, token) =>
  api.patch(
    `/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// Mark all notifications as read
export const markAllNotificationsAsReadAPI = (token) =>
  api.patch(
    "/read-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// Delete notification
export const deleteNotificationAPI = (notificationId, token) =>
  api.delete(`/${notificationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });