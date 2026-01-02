import axios from "axios";
import { API_BASE_URL } from "../apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/recommendations`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// 🔹 Founder → Co-founder recommendations
export const getRecommendedFoundersAPI = (token) =>
  api.get("/founders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// 🔹 Founder → Investor recommendations
export const getRecommendedInvestorsAPI = (token) =>
  api.get("/investors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });