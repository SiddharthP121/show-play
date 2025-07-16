import React, { useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import HotThoughts from "./HotThoughts";
import AllVideos from "./AllVideos";
import LastFoot from "./LastFoot";
import { useDarkMode } from "../DarkModeContext";

const Home = () => {
  const [search, setSearch] = useState("");
  const { isDarkModeOn } = useDarkMode();

  return (
    <div className={`flex flex-col min-h-screen overflow-hidden select-none
      ${isDarkModeOn
        ? "bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#232323]"
        : "bg-gradient-to-br from-blue-100 via-white to-purple-200"}`}>
      
      <TopBar search={search} setSearch={setSearch} handleSearch={() => {}} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <aside className="hidden md:block w-56 h-screen sticky top-24">
          <Sidebar />
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex flex-col flex-grow overflow-y-auto pt-24 pb-24">
          <div className="flex flex-col md:flex-row gap-6 px-4 flex-grow">
            <div className="w-full md:w-[60%]">
              <AllVideos />
            </div>
            <div className="hidden md:block md:w-[25%]">
              <HotThoughts />
            </div>
          </div>

          {/* Footer inside scroll area */}
          <LastFoot />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
