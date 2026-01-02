import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/match-requests`,
  withCredentials: true,
});

/* ======================================
   AUTH REQUIRED
====================================== */

// Send match request
export const sendMatchRequestAPI = (data, token) =>
  api.post("/send", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Get incoming match requests
export const getIncomingMatchRequestsAPI = (token) =>
  api.get("/incoming", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Get sent match requests
export const getSentMatchRequestsAPI = (token) =>
  api.get("/sent", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Respond to match request (accept / reject)
export const respondToMatchRequestAPI = (requestId, action, token) =>
  api.post(
    `/${requestId}/respond`,
    { action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// Cancel match request
export const cancelMatchRequestAPI = (requestId, token) =>
  api.post(
    `/${requestId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );