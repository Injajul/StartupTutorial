// pages/Profile.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import ThemeBtn from "../../components/theme/ThemeBtn";
import {
  FiArrowLeft,
  FiUserCheck,
  FiSearch,
  FiPlusCircle,
  FiEdit3,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import { FaUserFriends, FaChartLine } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();

  const { currentAuthUser, authUserLoading } = useSelector(
    (state) => state.user
  );

  if (authUserLoading || !currentAuthUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-primary text-xl font-medium">
          Loading profile...
        </div>
      </div>
    );
  }

  const activeRole = currentAuthUser.activeRole || null;
  const profile = currentAuthUser.profile || null;

  const hasProfile = !!profile;
  const isFounder = activeRole === "founder";
  const isInvestor = activeRole === "investor";

  // Fallback if role exists but profile not loaded yet
  if (activeRole && !profile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-primary text-xl font-medium">
          Loading your {activeRole} profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Sticky Header */}
      {/* ================= MOBILE / STICKY HEADER ================= */}
      <div className="sticky top-0 z-50 bg-bg/80 backdrop-blur-2xl border-b border-border shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl bg-surface shadow-lg hover:shadow-xl transition-all"
            >
              <FiArrowLeft className="w-6 h-6 text-text-primary" />
            </motion.button>

            <motion.h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              Your Profile
            </motion.h1>

            <ThemeBtn />
          </motion.div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* SIGNED IN */}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "w-10 h-10 ring-4 ring-accent/20 shadow-xl border-2 border-bg",
                    userButtonBox: "hover:scale-105 transition-transform",
                  },
                }}
              />
            </SignedIn>

            {/* SIGNED OUT */}
            <SignedOut>
              <motion.div whileTap={{ scale: 0.9 }}>
                <FaUserCircle
                  className="w-10 h-10 text-accent cursor-pointer drop-shadow-md"
                  onClick={() => navigate("/login")}
                />
              </motion.div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-border overflow-hidden"
        >
          {/* Gradient Top Bar */}
          <div className="h-32 bg-gradient-to-r from-accent via-accent-hover to-accent-secondary relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-8 pb-12 -mt-20">
            {/* Avatar + User Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-10">
              <div className="relative">
                <img
                  src={
                    profile?.profileImage?.url ||
                    currentAuthUser.imageUrl ||
                    "/default-avatar.png"
                  }
                  alt={currentAuthUser.fullName || "User"}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-8 border-card shadow-2xl ring-4 ring-accent/30"
                />
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-success rounded-full border-4 border-card shadow-lg flex items-center justify-center">
                  <FiUserCheck className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="text-center md:text-left z-40 flex-1">
                <h2 className="text-4xl md:text-4xl  font-black text-text-primary">
                  {currentAuthUser?.user?.fullName || "User"}
                </h2>

                {/* Role Badges */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                  {!activeRole && (
                    <span className="inline-flex items-center gap-2 px-5 py-3 bg-surface text-text-muted rounded-full font-semibold text-lg border border-border">
                      <FiSearch className="w-5 h-5" />
                      No Role Selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* ================= ACTION BUTTONS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* ================= CREATE / EDIT PROFILE ================= */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (isFounder) navigate("/founders/update");
                  else if (isInvestor) navigate("/investors/update");
                  else navigate("/select-role");
                }}
                className="
      group flex items-center justify-center gap-3
      px-4 py-2 sm:px-6 sm:py-4
      bg-gradient-to-r from-accent to-accent-hover
      text-white rounded-2xl sm:rounded-3xl
      font-bold text-sm sm:text-base lg:text-lg
      shadow-xl hover:shadow-accent/50
      transition-all duration-300
    "
              >
                {hasProfile ? (
                  <>
                    <FiEdit3 className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">
                      {isFounder ? "Edit Founder" : "Edit Investor"}
                    </span>
                  </>
                ) : (
                  <>
                    <FiPlusCircle className="w-5 h-5 sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="whitespace-nowrap">
                      {activeRole ? `Create ${activeRole}` : "Select Role"}
                    </span>
                  </>
                )}
              </motion.button>

              {/* ================= BROWSE MATCHES ================= */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/discover")}
                className="
      group flex items-center justify-center gap-3
      px-4 py-2 sm:px-6 sm:py-4
      bg-gradient-to-r from-accent-secondary to-accent-secondary-hover
      text-white rounded-2xl sm:rounded-3xl
      font-bold text-sm sm:text-base lg:text-lg
      shadow-xl hover:shadow-accent-secondary/50
      transition-all duration-300
    "
              >
                {isFounder ? (
                  <>
                    <FaChartLine className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">Browse Investors</span>
                  </>
                ) : isInvestor ? (
                  <>
                    <FaUserFriends className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">Browse Founders</span>
                  </>
                ) : (
                  <>
                    <FiSearch className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">Explore</span>
                  </>
                )}
              </motion.button>

              {/* ================= VIEW PUBLIC PROFILE ================= */}
              {activeRole && hasProfile && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    navigate(`/profile/${currentAuthUser.user._id}`)
                  }
                  className="
        group md:col-span-2
        flex items-center justify-center gap-3
        px-4 py-2 sm:px-6 sm:py-4
        bg-surface border border-border
        text-text-primary rounded-2xl sm:rounded-3xl
        font-bold text-sm sm:text-base lg:text-lg
        shadow-lg hover:shadow-2xl
        transition-all duration-300
      "
                >
                  {isFounder ? (
                    <>
                      <FiBriefcase className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                      <span className="whitespace-nowrap">
                        View Founder Profile
                      </span>
                    </>
                  ) : (
                    <>
                      <FiDollarSign className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                      <span className="whitespace-nowrap">
                        View Investor Profile
                      </span>
                    </>
                  )}
                </motion.button>
              )}

              {/* ================= CREATE ROLE PROFILES (ONLY IF NONE EXISTS) ================= */}
              {hasProfile && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/founders/create")}
                    className="
          group flex items-center justify-center gap-3
          px-4 py-2 sm:px-6 sm:py-4
          bg-surface border border-border
          text-text-primary rounded-2xl sm:rounded-3xl
          font-bold text-sm sm:text-base
          shadow-lg hover:shadow-xl
          transition-all duration-300
        "
                  >
                    <FiBriefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="whitespace-nowrap">
                      Create New Founder
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/investors/create")}
                    className="
          group flex items-center justify-center gap-3
          px-4 py-2 sm:px-6 sm:py-4
          bg-surface border border-border
          text-text-primary rounded-2xl sm:rounded-3xl
          font-bold text-sm sm:text-base
          shadow-lg hover:shadow-xl
          transition-all duration-300
        "
                  >
                    <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="whitespace-nowrap">
                      Create New Investor
                    </span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 text-text-muted text-sm">
          <p>FABLE • Built for founders & investors</p>
        </div>
      </div>
    </div>
  );
}