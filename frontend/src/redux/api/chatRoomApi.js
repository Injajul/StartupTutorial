import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/chat-rooms`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Create chat room (after connection)
export const createChatRoomAPI = (data, token) =>
  api.post("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Get my chat rooms
export const getMyChatRoomsAPI = (token) =>
  api.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Archive chat room (soft delete)
export const archiveChatRoomAPI = (roomId, token) =>
  api.patch(
    `/${roomId}/archive`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );