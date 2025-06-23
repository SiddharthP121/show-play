import React, { useEffect, useState, createContext, useContext } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import axios from "axios";
import AccountVideos from "./AccountVideos";
import { useNavigate } from "react-router-dom";
import AccountThoughts from "./AccountThoughts";
import AccountComments from "./AccountComments";

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
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Optional: search logic
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/profile",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.data.user);
    } catch (error) {
      console.log(error?.response?.data?.message || "Failed to fetch user");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleVideosSearch = async () => {
    setselect(1);
    console.log(select);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/videos/your-videos",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const res = await axios.get(
        "http://localhost:8000/api/v1/tweet/user/thoughts",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    <userContext.Provider value={user}>
      <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen overflow-x-hidden select-none">
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
          <main>
            <div className="w-full max-w-sm mx-auto mt-10 px-6 py-8 space-y-4">
              <div className="w-full max-w-md mx-auto mt-16 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl px-8 py-10">
                <h1 className="text-center text-lg font-semibold text-black mb-6">
                  You are not logged in to your account
                </h1>
                <ul className="space-y-4">
                  <li>
                    <button
                      onClick={() => navigate("/users/login")}
                      className="w-full py-3 rounded-lg border border-purple-500 text-purple-500 font-medium tracking-wide hover:shadow-[0_0_12px_2px_rgba(168,85,247,0.5)] hover:text-purple-400 transition-all duration-300"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/users/register")}
                      className="w-full py-3 rounded-lg border border-blue-500 text-blue-500 font-medium tracking-wide hover:shadow-[0_0_12px_2px_rgba(59,130,246,0.5)] hover:text-blue-400 transition-all duration-300"
                    >
                      Signup
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </main>
        ) : (
          <main className="pt-20 pb-32 bg-red-50 border-black rounded-3xl min-h-screen lg:pl-60">
            {/* Cover and Avatar section */}
            <div className="relative w-full mb-20">
              <img
                className="w-full h-40 sm:h-64 md:h-72 lg:h-80 object-cover"
                src={user?.coverImage || "No cover Image found"}
                alt="Cover"
              />
              {user && (
                <img
                  className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md object-cover"
                  src={user.avtar}
                  alt="Avatar"
                />
              )}
            </div>

            {/* User Info */}
            <div className="userInfo text-black space-y-2 text-center px-4 mt-8">
              {user ? (
                <>
                  <p className="text-xl font-semibold">
                    Welcome! {user.fullname}
                  </p>
                  <p>👤 {user.username}</p>
                  <p>📧 {user.email}</p>
                  <p>
                    📅 Joined on {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p>Loading user info...</p>
              )}
            </div>

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
              <button
                onClick={handleCommentSearch}
                className={
                  select === 3
                    ? "hover:cursor-pointer bg-red-400 font-bold rounded-lg py-1.5 px-3"
                    : "hover:cursor-pointer bg-white"
                }
              >
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
          </main>
        )}

        <BottomNav />
      </div>
    </userContext.Provider>
  );
};

export default Account;
