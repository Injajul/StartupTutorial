import React, { useState } from "react";
import { Outlet } from "react-router-dom";

// import Sidebar from "../components/home/Sidebar";

export default function AppMainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-card text-text-primary overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      /> */}

      {/* Main Content */}
      <main
        className={`
        flex-1 transition-all duration-300 pt-16 lg:pt-0 
        ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"}
      `}
      >
        <Outlet />
      </main>
    </div>
  );
}