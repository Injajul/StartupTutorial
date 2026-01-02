import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/connections`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Get my connections
export const getMyConnectionsAPI = (token) =>
  api.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Get single connection by ID
export const getConnectionByIdAPI = (connectionId, token) =>
  api.get(`/${connectionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });