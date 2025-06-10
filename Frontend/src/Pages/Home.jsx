import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillPlayCircle, AiFillHome, AiOutlinePlus } from 'react-icons/ai'
import { MdAccountCircle, MdHistory, MdSettings } from 'react-icons/md'
import { MdForum } from 'react-icons/md'

const cards = [
  // Example data, replace with your fetched data
  {
    id: 1,
    title: "Sample Video",
    description: "This is a sample video description.",
    owner: "John Doe",
    views: 123,
    createdAt: "2024-06-09",
  },
  // Add more cards as needed
]

const Home = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleClick = () => {
    navigate("/users/register")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement your search logic here
  }

  const handlePlus = () => {
    navigate("/addvideo")
  }

  return (
    <div className="select-none min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200 overflow-x-hidden">
      {/* Top bar */}
      <div className="top-bar fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center px-4 py-3 gap-2">
        {/* Show-Play logo and title */}
        <div className="logo flex items-center">
          <AiFillPlayCircle size={32} className="text-purple-600" />
          <h1 className="text-xl font-bold text-purple-700 ml-2">Show-Play</h1>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center ml-2 justify-end"
        >
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search..."
              className="w-full px-5 py-2 border font-bold text-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:font-bold placeholder:text-gray-500"
              style={{ paddingLeft: "1.7 rem" }}
            />
          </div>
          {/* Account icon next to search bar on mobile */}
          <Link
            to="/account"
            className="ml-2 flex md:hidden items-center justify-center"
          >
            <MdAccountCircle size={28} className="text-purple-700" />
          </Link>
        </form>
      </div>

      {/* Main content */}
      <div className="pt-[64px] flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar for desktop */}
        <nav className="hidden md:block fixed bg-white shadow-md md:w-56 min-h-screen py-8 px-4 left-0 top-0 z-40">
          <ul className="flex flex-col gap-3 mt-16">
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
              <Link to="/tweets" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
                <MdForum size={20} className="mr-2" /> Tweets
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center px-4 py-2 rounded-md font-medium text-purple-700 hover:bg-purple-100">
                <MdSettings size={20} className="mr-2" /> Settings
              </Link>
            </li>

            
            {/* Temporary Login and Signup Buttons */}
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
                onClick={() => navigate('/users/register')}
                className="w-full flex items-center justify-center px-4 py-2 mt-2 rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Signup
              </button>
            </li>
          </ul>
        </nav>

        {/* Card Section */}
        <main className="flex-1 flex flex-col items-center justify-center md:ml-56 min-h-screen">
          <div className="card-container px-2 pt-2 pb-20 md:px-2 md:pb-0 w-full flex flex-col items-center justify-center">
            {cards.map((card) => (
              <div
                key={card.id}
                className="w-full max-w-2xl border rounded-2xl shadow-lg bg-white p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6 my-4"
              >
                <div className="thumbnail border rounded-xl bg-gray-100 flex items-center justify-center w-full h-40 md:w-56 md:h-40 mb-3 md:mb-0">
                  {/* Replace with actual image */}
                  <span className="text-gray-400">Thumbnail image</span>
                </div>
                <div className="videoInfo flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="title text-lg md:text-2xl font-bold text-purple-700 mb-1">
                      {card.title}
                    </h3>
                    <p className="description text-sm md:text-base text-gray-700 mb-2">
                      {card.description}
                    </p>
                    <p className="owner text-xs md:text-sm text-gray-500 mb-2">
                      {card.owner}
                    </p>
                  </div>
                  <div className="generalInfo flex gap-4 text-xs md:text-sm text-gray-500">
                    <p className="totalViews">{card.views} Views</p>
                    <p className="createdAt">{card.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
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
  )
}

export default Home