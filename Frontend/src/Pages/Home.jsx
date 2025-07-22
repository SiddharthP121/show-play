import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import HotThoughts from "./HotThoughts";
import AllVideos from "./AllVideos";
import { useDarkMode } from "../DarkModeContext";
import LastFoot from "./LastFoot";
import axios from "axios";

const Home = () => {
  const [search, setSearch] = useState("");
  const { isDarkModeOn } = useDarkMode();
  const [searchResults, setSearchResults] = useState(null)
  const baseUrl = import.meta.env.VITE_DEFAULT_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    // Add search logic
    if(search.trim() === ""){
      setSearchResults(null)
      return
    }
    try {
      const res = await axios.get(`${baseUrl}/videos/search`, {
        params: {query: search}
      });
      setSearchResults(res.data.data.videos)
    } catch (error) {
      alert("No videos found")
      setSearchResults([])
    }
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden select-none 
    ${
      isDarkModeOn
        ? "bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#232323]"
        : "bg-gradient-to-br from-blue-100 via-white to-purple-200"
    }`}
    >
      <TopBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

      <Sidebar />

      {/* Main Content */}
      <main className="pt-24 md:mx-auto px-1.5 pb-15">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Left Panel - Empty to balance Sidebar */}
          <div className="hidden md:block w-[15%]" />

          {/* Center - AllVideos */}
          <div className="w-full md:w-[60%] flex justify-center">
            <AllVideos searchResults = {searchResults} />
          </div>

          {/* Right Panel - HotThoughts */}
          <div className="hidden md:block w-[25%]">
            <HotThoughts />
          </div>
        </div>
        <div className="w-full md:w-[62vw] md:ml-[15.5vw] flex justify-center">
          <LastFoot />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
