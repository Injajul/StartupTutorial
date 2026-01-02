import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/founders`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Create founder profile
export const createFounderProfileAPI = (data, token) =>
  api.post("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update founder profile
export const updateFounderProfileAPI = (data, token) =>
  api.put("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });



/* ======================================
   PUBLIC
====================================== */

// Get founder profile by userId
export const getFounderProfileByUserIdAPI = (userId) => api.get(`/${userId}`);




// Fetch all founders
export const fetchAllFoundersAPI = () => api.get("/all");

// 🌍 Search founders (public)
export const searchFoundersAPI = (filters = {}, token) =>
  api.get("/search", {
    params: filters,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });