import React, { useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import HotThoughts from "./HotThoughts";
import AllVideos from "./AllVideos";
import { useDarkMode } from "../DarkModeContext";
import LastFoot from "./LastFoot";

const Home = () => {
  const [search, setSearch] = useState("");
  const { isDarkModeOn } = useDarkMode();

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic
  };

  return (
    <div
      className={`flex flex-col min-h-screen overflow-x-hidden select-none
        ${
          isDarkModeOn
            ? "bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#232323]"
            : "bg-gradient-to-br from-blue-100 via-white to-purple-200"
        }`}
    >
      <div>

      <TopBar search={search} setSearch={setSearch} handleSearch={handleSearch} />
      <Sidebar />
      </div>

      <main className="flex flex-col grow pt-24 md:mx-auto px-1.5 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 flex-grow">
          <div className="hidden md:block w-[15%]" />
          <div className="w-full md:w-[60%] flex justify-center">
            <AllVideos />
          </div>
          <div className="hidden md:block w-[25%]">
            <HotThoughts />
          </div>
        </div>

        <div className="w-[70vw] ml-[10vw] flex justify-center">
          <LastFoot />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
