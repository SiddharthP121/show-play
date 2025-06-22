import React, { useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Settings = () => {
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [isLogout, setIsLogout] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic
  };

  const settingsItems = [
    "Change Avatar",
    "Change Cover Image",
    "Change Account Details",
    "Update Password",
    "Appearence",
    "Verify Email",
  ];

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      setIsLogout(true);
      navigate("/");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // if (token) {
  //   setIsLogout(true)
  // }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen overflow-x-hidden select-none">
        {/* Top Bar */}
        <TopBar
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />

        {/* Sidebar (Fixed) */}
        <Sidebar />

        {/* Main Content */}
        <main className="pt-24 pb-24 px-4 md:px-8 md:ml-50 lg:px-16 bg-transparent">
          <div className="flex flex-col items-center gap-6">
            {/* Left spacer panel only on wider screens */}
            <div className="hidden md:block w-[15%]" />

            {/* Vertical column for all screen sizes */}
            <div className="flex flex-col gap-4 w-full md:w-[60%]">
             {!isLogout && 
              <div>
              {settingsItems.map((item, index) => (
                <button
                key={index}
                className="my-3 px-4 py-2 border border-solid rounded-xl bg-transparent hover:text-gray-500 hover:shadow-md cursor-pointer transition-all duration-200 text-sm md:text-base w-full flex justify-center items-center text-center"
                >
                  {item}
                </button>
              ))}
              </div>
             }

              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-6 rounded-lg border border-red-700 text-red-600 font-medium tracking-wide hover:shadow-[0_0_12px_2px_rgba(168,85,247,0.5)] hover:text-red-700 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <main className="">
                  <ul className="space-y-4 flex justify-around">
                    <li>
                      <button
                        onClick={() => navigate("/users/login")}
                        className="w-full py-2 px-6 rounded-lg border border-purple-500 text-purple-500 font-medium tracking-wide hover:shadow-[0_0_12px_2px_rgba(168,85,247,0.5)] hover:text-purple-400 transition-all duration-300"
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/users/register")}
                        className="w-full py-2 px-6 rounded-lg border border-blue-500 text-blue-500 font-medium tracking-wide hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.5)] hover:text-blue-400 transition-all duration-300"
                      >
                        Signup
                      </button>
                    </li>
                  </ul>
                </main>
              )}
            </div>
          </div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav />
      </div>
    </>
  );
};

export default Settings;
