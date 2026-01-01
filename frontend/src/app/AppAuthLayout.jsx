import { Outlet } from "react-router-dom";
import React from "react";

export default function AppAuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-card text-text-primary">
      <main className="flex-1 flex items-center justify-center">
        <Outlet /> {/* Login / Signup will render here */}
      </main>
    </div>
  );
}