import React, { useEffect, useState, createContext, useContext } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import axios from "axios";
import AccountVideos from "./AccountVideos";
import { useNavigate } from "react-router-dom";
import AccountThoughts from "./AccountThoughts";
import AccountComments from "./AccountComments";
import { useDarkMode } from "../DarkModeContext";
import LastFoot from "./LastFoot";
export const userContext = createContext();
export const useUser = () => useContext(userContext);
const Account = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [select, setselect] = useState(1);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const { isDarkModeOn } = useDarkMode();
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Optional: search logic
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${baseURL}/users/profile`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.data.user);
    } catch (error) {
      console.log(error?.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleVideosSearch = async () => {
    setselect(1);
    console.log(select);
    try {
      const res = await axios.get(`${baseURL}/videos/your-videos`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(res.data.data);
      console.log(videos);
    } catch (error) {
      console.log("Unable to fetch the videos");
    }
  };

  useEffect(() => {
    handleVideosSearch();
  }, []);

  const handleThoughtSearch = async () => {
    setselect(2);
    console.log(select);
    try {
      const res = await axios.get(`${baseURL}/tweet/user/thoughts`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setThoughts(res.data.data);
      console.log(thoughts);
    } catch (error) {
      console.log(
        error.response.data.message ||
          "Unable to fetch the thoughts at the moment"
      );
    }
  };
  const handleCommentSearch = () => {
    setselect(3);
    console.log(select);
  };

  const sections = {
    1: <AccountVideos videos={videos} />,
    2: <AccountThoughts thoughts={thoughts} setThoughts={setThoughts} />,
    3: <AccountComments />,
  };

  return (
    <div
      className={`bg-gradient-to-br
        ${
          isDarkModeOn
            ? "bg-gradient-to-br from-gray-900 dark:via-gray-800 to-gray-700"
            : "bg-gradient-to-tr from-purple-300 via-fuchsia-300 to-pink-300"
        } min-h-screen overflow-x-hidden select-none`}
    >
      <TopBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      {/* Hide sidebar on small screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {!token ? (
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-md py-8 space-y-4">
            <div
              className={`w-full px-6 sm:px-8 py-10 rounded-2xl backdrop-blur-lg transition-colors duration-300 mx-auto
        ${
          isDarkModeOn
            ? "bg-[#1e1e1e] border border-gray-700 shadow-lg"
            : "bg-white border border-gray-200 shadow-md"
        }`}
            >
              <h1
                className={`text-center text-lg font-semibold mb-6 ${
                  isDarkModeOn ? "text-gray-100" : "text-gray-800"
                }`}
              >
                You are not logged in to your account
              </h1>

              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => navigate("/users/login")}
                    className={`w-full py-3 rounded-lg font-medium tracking-wide transition-all duration-300
              ${
                isDarkModeOn
                  ? "border border-purple-500 text-purple-300 hover:text-purple-400 hover:shadow-md"
                  : "border border-purple-600 text-purple-600 hover:text-purple-500 hover:shadow"
              }`}
                  >
                    Login
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/users/register")}
                    className={`w-full py-3 rounded-lg font-medium tracking-wide transition-all duration-300
              ${
                isDarkModeOn
                  ? "border border-blue-400 text-blue-400 hover:text-blue-300 hover:shadow-md"
                  : "border border-blue-500 text-blue-500 hover:text-blue-600 hover:shadow"
              }`}
                  >
                    Signup
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </main>
      ) : (
        <main
          className={`pt-16 pb-32 ${
            isDarkModeOn
              ? "bg-gradient-to-br from-purple-900 via-gray-700 to-black border-white"
              : " bg-red-50 border-black"
          } rounded-3xl min-h-screen lg:pl-60`}
        >
          {/* Cover and Avatar section */}
          <div className="relative w-full mb-20">
            {user && (
              <img
                className="w-full h-55 sm:h-6 md:h-87 lg:h-95 object-cover"
                src={user?.coverImage || "No cover Image found"}
                alt="Cover"
              />
            )}
            {user && (
              <img
                className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 w-42 h-42 sm:w-46 sm:h-46 md:w-50 md:h-50 rounded-full border-4 border-white shadow-md object-cover"
                src={user.avtar}
                alt="Avatar"
              />
            )}
          </div>

          {/* User Info */}
          <div className="userInfo text-black space-y-2 text-center px-4 mt-8">
            {user && (
              <div>
                <p
                  className={`text-xl ${
                    isDarkModeOn ? "text-gray-100" : "text-black"
                  } font-semibold`}
                >
                  Welcome! {user.fullname}
                </p>
                <p
                  className={` ${
                    isDarkModeOn ? "text-gray-200" : "text-black"
                  }`}
                >
                  👤 {user.username}
                </p>
                <p
                  className={` ${
                    isDarkModeOn ? "text-gray-200" : "text-black"
                  }`}
                >
                  📧 {user.email}
                </p>
                <p
                  className={` ${
                    isDarkModeOn ? "text-gray-400" : "text-gray-300-"
                  }`}
                >
                  📅 Joined on {new Date(user.createdAt).toLocaleDateString()}
                </p>

                <section className="h-1 mt-8 mb-2 bg-gray-400 "></section>

                {/* Buttons Section */}
                <div className="buttons flex sm:flex-row gap-4 justify-around items-center px-4">
                  <button
                    onClick={handleVideosSearch}
                    className={
                      select === 1
                        ? "hover:cursor-pointer bg-red-400 font-bold rounded-lg py-1.5 px-3"
                        : "hover:cursor-pointer bg-white"
                    }
                  >
                    Videos
                  </button>
                  <button onClick={handleCommentSearch} className="button">
                    Comments
                  </button>
                  <button
                    onClick={handleThoughtSearch}
                    className={
                      select === 2
                        ? "hover:cursor-pointer bg-red-400 font-bold rounded-lg py-1.5 px-3"
                        : "hover:cursor-pointer bg-white"
                    }
                  >
                    Hot-Thoughts
                  </button>
                </div>

                <section className="h-1 mt-2 bg-gray-400"></section>

                {/* {select === 1 ? (
            <AccountVideos videos={videos} />
            ) : (
              <div className="btn">
              <h1>404 not found: Unable to fetch the videos at the moment</h1>
              </div>
              )}
              {select === 2 ? (
                <AccountThoughts thoughts={thoughts} setThoughts= {settho} />
                ) : (
                  <div className="btn">
                  <h1>404 not found: Unable to fetch the hot-thoughts at the moment</h1>
                  </div>
                  )} */}

                <div>{sections[select]}</div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center min-h-screen bg-transparent">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500 opacity-30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-600 animate-spin"></div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
      <div className="w-full md:ml-[15.5vw] flex justify-center">
        <LastFoot />
      </div>
      <BottomNav />
    </div>
  );
};

export default Account;
