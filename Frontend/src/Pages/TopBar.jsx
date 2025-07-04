import React from "react";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { useDarkMode } from "../DarkModeContext";
import LogoDark from "../assets/Logo.dark.png";
import LogoLight from "../assets/Logo.light.png";

const TopBar = ({ search, setSearch, handleSearch }) => {
  const { isDarkModeOn } = useDarkMode();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 shadow-md flex items-center justify-between px-4 py-2 ${isDarkModeOn?"bg-black": " bg-white"} transition-colors`}
    >
     
      <div className="flex items-center gap-3">
        <img
          className="w-32 h-auto max-h-12 object-contain"
          src={isDarkModeOn ? LogoDark : LogoLight}
          alt="Logo"
        />
      </div>

      
      <form
        onSubmit={handleSearch}
        className="flex-grow max-w-md mx-4 relative"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search..."
          className={`w-full px-5 py-2 pl-7 border rounded-3xl font-medium text-sm transition focus:outline-none focus:ring-2 ${
            isDarkModeOn
              ? "bg-gray-800 text-white placeholder:text-gray-400 focus:ring-yellow-400"
              : "bg-white text-gray-800 placeholder:text-gray-500 focus:ring-purple-500"
          }`}
        />
      </form>

    
      <Link to="/account" className="ml-3">
        <MdAccountCircle
          size={30}
          className={`${
            isDarkModeOn ? "text-purple-400" : "text-purple-700"
          }`}
        />
      </Link>
    </header>
  );
};

export default TopBar;