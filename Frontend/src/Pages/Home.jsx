import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillPlayCircle, AiFillHome, AiOutlinePlus } from 'react-icons/ai';
import { MdAccountCircle, MdHistory, MdSettings, MdForum } from 'react-icons/md';
import AllVideos from './AllVideos';
import HotThoughts from './HotThoughts';


const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleClick = () => navigate("/users/register");
  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic here
  };
  const handlePlus = () => navigate("/addvideo");

  return (
    <div className="select-none bg-gradient-to-br from-blue-100 to-purple-200 overflow-x-hidden min-h-screen">
      {/* Top Bar */}
      <div className="top-bar fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center px-4 py-3 gap-2">
        <div className="logo flex items-center">
          <AiFillPlayCircle size={32} className="text-purple-600" />
          <h1 className="text-xl font-bold text-purple-700 ml-2">Show-Play</h1>
        </div>
        <form onSubmit={handleSearch} className="flex-1 flex items-center ml-2 justify-end">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search..."
              className="w-full px-5 py-2 border font-bold text-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:font-bold placeholder:text-gray-500 pl-7"
            />
          </div>
        </form>
          <Link to="/account" className="ml-2 flex md:hidden items-center justify-center">
            <MdAccountCircle size={28} className="text-purple-700" />
          </Link>
      </div>

      {/* Sidebar (Left - Fixed) */}
      <nav className="hidden md:block fixed bg-white shadow-md md:w-56 h-screen py-8 px-4 left-0 top-0 z-40 pt-20 overflow-hidden">
        <ul className="flex flex-col gap-3">
          <li>
            <Link to="/" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
              <AiFillHome size={20} className="mr-2" /> Home
            </Link>
          </li>
          <li>
            <Link to="/addvideo" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
              <AiOutlinePlus size={20} className="mr-2" /> Add Video
            </Link>
          </li>
          <li>
            <Link to="/watch-history" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
              <MdHistory size={20} className="mr-2" /> History
            </Link>
          </li>
         
          <li>
            <Link to="/settings" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
              <MdSettings size={20} className="mr-2" /> Settings
            </Link>
          </li>
          <li>
            <Link to="/account" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
              <MdAccountCircle size={20} className="mr-2" /> Account
            </Link>
          </li>
          <li>
            <button
              onClick={() => navigate('/users/login')}
              className="w-full flex items-center justify-center px-4 py-2 mt-4 rounded-md font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Login
            </button>
          </li>
          <li>
            <button
              onClick={handleClick}
              className="w-full flex items-center justify-center px-4 py-2 mt-2 rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Signup
            </button>
          </li>
        </ul>
      </nav>

      {/* Tweets Sidebar (Fixed Right) */}
      <HotThoughts />

      {/* Main Content */}
      <main className="flex pt-20 md: lg:pr-80 px-4">
        <div className="flex w-[100vw] ">
          <AllVideos />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t md:hidden flex justify-around items-center h-16 border-t z-50">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center text-center py-2 font-medium text-gray-500">
          <AiFillHome size={28} />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/watch-history" className="flex-1 flex flex-col items-center justify-center text-center py-2 font-medium text-gray-500">
          <MdHistory size={28} />
          <span className="text-xs">History</span>
        </Link>
        <button
          onClick={handlePlus}
          className="flex-1 flex flex-col items-center justify-center text-center py-2 font-medium text-purple-600 focus:outline-none"
          style={{
            marginTop: "-24px",
            background: "white",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(128,0,128,0.15)",
          }}
        >
          <span className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg">
            <AiOutlinePlus size={32} />
          </span>
        </button>
        <Link to="/tweets" className="flex-1 flex flex-col items-center justify-center text-center py-2 font-medium text-gray-500">
          <MdForum size={28} />
          <span className="text-xs">Tweets</span>
        </Link>
        <Link to="/settings" className="flex-1 flex flex-col items-center justify-center text-center py-2 font-medium text-gray-500">
          <MdSettings size={28} />
          <span className="text-xs">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Home;
