import React, { useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import HotThoughts from "./HotThoughts";
import AllVideos from "./AllVideos";

const Home = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic
  };

 return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen overflow-x-hidden select-none">
      {/* Top Bar */}
      <TopBar search={search} setSearch={setSearch} handleSearch={handleSearch} />

      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content */}
      <main className="pt-24 md:mx-auto px-4 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Left Panel - Empty to balance Sidebar */}
          <div className="hidden md:block w-[15%]" />

          {/* Center - AllVideos */}
          <div className="w-full md:w-[60%] flex justify-center">
            <AllVideos />
          </div>

          {/* Right Panel - HotThoughts */}
          <div className="hidden md:block w-[25%]">
            <HotThoughts />
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
};

export default Home;