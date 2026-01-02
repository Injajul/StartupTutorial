import { FiSun, FiMoon } from "react-icons/fi";
import useTheme from "../../lib/useTheme";
import React from "react";
export default function ThemeBtn() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center justify-center
        h-10 w-10 rounded-xl
        border border-border
        bg-card
        text-text-primary
        hover:bg-surface
        transition-colors duration-200
      "
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5 text-yellow-400" />
      ) : (
        <FiMoon className="h-5 w-5 text-indigo-500" />
      )}
    </button>
  );
}