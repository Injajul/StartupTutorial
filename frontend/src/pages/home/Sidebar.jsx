import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FaHome,
  FaBell,
  FaUserFriends,
  FaSearch,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ThemeBtn from "../../components/theme/ThemeBtn";

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();

  /* ----------------------------------
     🔔 NOTIFICATION STATE
  ---------------------------------- */
  const { list } = useSelector((state) => state.notification);

  // unread notifications count
  const notificationCount = list.filter((n) => !n.isRead).length;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const navItems = [
    { to: "/", icon: FaHome, text: "Home" },
    { to: "/notifications", icon: FaBell, text: "Notifications" },
    { to: "/connections", icon: FaUserFriends, text: "Connections" },
    { to: "/discover", icon: FaSearch, text: "Discover" },
    { to: "/profile", icon: FaUserCircle, text: "Profile" },
  ];

  return (
    <>
      {/* ====================== MOBILE TOP HEADER (< lg) ====================== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-bg/80 backdrop-blur-2xl border-b border-border z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.h1 className="text-2xl font-black bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
            FABLE
          </motion.h1>
          <ThemeBtn />
        </motion.div>

        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "w-10 h-10 ring-4 ring-accent/20 shadow-xl border-2 border-bg",
                },
              }}
            />
          </SignedIn>
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

      {/* ====================== DESKTOP SIDEBAR (lg+) ====================== */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 flex-col bg-card/95 backdrop-blur-3xl border-r border-border shadow-2xl transition-all duration-500 z-50 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center gap-5 p-6 border-b border-border">
          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-white shadow-xl"
          >
            <FaBars className="text-xl" />
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{
              opacity: isSidebarOpen ? 1 : 0,
              x: isSidebarOpen ? 0 : -30,
            }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-black bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent whitespace-nowrap"
          >
            FABLE
          </motion.h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-5  rounded-3xl transition-all duration-300 font-medium
                ${
                  isActive
                    ? "bg-gradient-to-r from-accent to-accent-hover text-white shadow-2xl scale-105"
                    : "text-text-primary hover:bg-surface hover:shadow-xl hover:scale-105"
                }
                 ${isSidebarOpen ? "p-4 justify-start" : "p-2 justify-center"}`
              }
            >
              <div className="relative">
                <item.icon className="text-2xl" />

                {/* 🔔 NOTIFICATION BADGE */}
                {item.text === "Notifications" && notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-error text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-xl"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </div>

              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-semibold"
                >
                  {item.text}
                </motion.span>
              )}

              {!isSidebarOpen && (
                <span className="absolute left-full ml-4 whitespace-nowrap bg-card text-text-primary text-sm font-medium py-2 px-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl border border-border pointer-events-none z-50">
                  {item.text}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-border flex items-center justify-between gap-4">
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
      </motion.div>

      {/* ====================== MOBILE BOTTOM NAVBAR ====================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-3xl border-t border-border shadow-2xl z-50">
        <div className="flex justify-around items-center py-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="flex-1" end>
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={`flex justify-center py-3 rounded-3xl transition-all duration-300
              ${
                isActive
                  ? "text-accent bg-accent/10 shadow-lg"
                  : "text-text-muted hover:text-accent hover:bg-accent/5"
              }`}
                >
                  {/* 🔔 ICON WRAPPER (THIS IS THE KEY FIX) */}
                  <div className="relative">
                    <item.icon className="text-2xl" />

                    {/* 🔔 MOBILE BADGE */}
                    {item.text === "Notifications" && notificationCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="
                    absolute
                    -top-1
                    -right-1
                    bg-error
                    text-white
                    text-[10px]
                    font-bold
                    rounded-full
                    w-4
                    h-4
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                      >
                        {notificationCount}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;