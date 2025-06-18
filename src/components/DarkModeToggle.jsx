import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const DarkModeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={`relative inline-flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <div className="relative w-12 h-6 transition duration-300 bg-gray-200 dark:bg-gray-700 rounded-full">
        {/* Track */}
        <div 
          className={`absolute inset-y-0 left-0 flex items-center justify-center w-6 h-6 transition-transform duration-300 transform 
            ${isDark ? 'translate-x-6 bg-indigo-600' : 'bg-yellow-500'} 
            rounded-full shadow-md`}
        >
          {/* Sun/Moon Icon */}
          {isDark ? (
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path 
                fillRule="evenodd" 
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
                clipRule="evenodd">
              </path>
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;