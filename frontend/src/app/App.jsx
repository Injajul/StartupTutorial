import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { ToastContainer } from "react-toastify";
import { fetchCurrentAuthUser } from "../redux/slices/userSlice";
import { useAuth } from "@clerk/clerk-react";
// import { getMyNotifications } from "../redux/slices/notificationSlice";
// import { getIncomingMatchRequests, getSentMatchRequests } from "../redux/slices/matchRequestSlice";

export default function App() {
  const dispatch = useDispatch();
  const { getToken, isLoaded } = useAuth();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const token = await getToken();
//       dispatch(getMyNotifications(token));
//     };

//     fetchNotifications();
//   }, [dispatch, getToken]);

//   useEffect(() => {
//     const fetchSentMatchRequests = async () => {
//       const token = await getToken();
//       dispatch(getSentMatchRequests(token));
//       dispatch(getIncomingMatchRequests(token));
//     };

//     fetchSentMatchRequests();
//   }, [dispatch, getToken]);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        dispatch(fetchCurrentAuthUser(token));
      } catch (err) {
        console.error("Failed to get Clerk token", err);
      }
    };

    fetchUser();
  }, [dispatch, getToken, isLoaded]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
