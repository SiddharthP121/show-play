import React from "react";
import { Link } from "react-router-dom";
import { AiFillPlayCircle } from "react-icons/ai";
import { useDarkMode } from "../DarkModeContext";
import { MdAccountCircle } from "react-icons/md";

const TopBar = ({ search, setSearch, handleSearch }) => {

  const {isDarkModeOn} = useDarkMode();
  return (
<header
  className={`fixed top-0 left-0 right-0 z-50 
    ${isDarkModeOn ? "bg-[#1F1F1F] text-[#F1F1F1] border-b border-[#2A2A2A]" : "bg-white text-[#1A1A1A] border-b border-[#E0E0E0]"} 
    shadow flex items-center px-4 py-3 gap-2`}
>      <div className="flex items-center gap-2">
        <AiFillPlayCircle size={32} className="text-purple-600" />
        <h1 className={`text-xl font-bold ${isDarkModeOn?"text-white":" text-purple-700"}`}>Show-Play</h1>
      </div>
      <form
        onSubmit={handleSearch}
        className="ml-auto w-full md:w-72 relative"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search..."
          className={`w-full px-5 py-2 pl-7 border rounded-3xl font-bold text-gray-800 ${isDarkModeOn?"placeholder:text-gray-200 text-white focus:ring-yellow-400":" placeholder:text-gray-500  focus:ring-purple-500"} focus:outline-none focus:ring-2 transition
        `}/>
      </form>
      <Link to="/account" className="ml-3 md:hidden">
        <MdAccountCircle size={28} className="text-purple-700" />
      </Link>
    </header>
  );
};

export default TopBar;
