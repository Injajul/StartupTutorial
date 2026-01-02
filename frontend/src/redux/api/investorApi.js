import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/investors`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Create investor profile
export const createInvestorProfileAPI = (data, token) =>
  api.post("/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update investor profile
export const updateInvestorProfileAPI = (data, token) =>
  api.put("/update", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });



/* ======================================
   PUBLIC
====================================== */

// Get investor profile by userId
export const getInvestorProfileByUserIdAPI = (userId) =>
  api.get(`/${userId}`);

// 🌍 Search investors (public)
export const searchInvestorsAPI = (filters = {}, token) =>
  api.get("/search", {
    params: filters,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
