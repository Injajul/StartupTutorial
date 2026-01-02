import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/messages`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Send message
export const sendMessageAPI = (data, token) =>
  api.post("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Get messages by room
export const getMessagesByRoomAPI = (roomId, token) =>
  api.get(`/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });