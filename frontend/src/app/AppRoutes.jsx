import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import AppAuthLayout from "./AppAuthLayout";
import AppMainLayout from "./AppMainLayout";
import Home from "../pages/home/Home";
import Signup from "../pages/register/Signup";
import Login from "../pages/register/Login";
import UpdateFounderProfile from "../pages/founder/UpdateFounderProfile";
import CreateFounderProfile from "../pages/founder/CreateFounderProfile";
import SelectRole from "../pages/register/SelectRole";
import FounderPublicProfile  from "../pages/founder/FounderPublicProfile"

import CreateInvestorProfile from "../pages/investor/CreateInvestorProfile"
import UpdateInvestorProfile from "../pages/investor/UpdateInvestorProfile"
function AppRoutes() {
  return (
     <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route element={<AppAuthLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= MAIN APPLICATION ROUTES ================= */}
      <Route element={<AppMainLayout />}>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/founders/create" element={<CreateFounderProfile />} />
        <Route path="/founders/update" element={<UpdateFounderProfile />} />

        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<OwnProfile />} />
        <Route path="/founders/:userId" element={<FounderPublicProfile />} />
        <Route path="/investors/:userId" element={<OwnProfile />} /> */}


        <Route path="/investors/create" element={<CreateInvestorProfile />} />
        <Route path="/investors/update" element={<UpdateInvestorProfile />} />

        {/* <Route path="/connections" element={<ConnectionMain />} />

        <Route path="/chat/:roomId" element={<ChatRoom />} />

        <Route path="/notifications" element={<NotificationsPage />} />
        
        <Route path="/discover" element={<Discover />} /> */}
      </Route>
    </Routes>
  )
}

export default AppRoutes