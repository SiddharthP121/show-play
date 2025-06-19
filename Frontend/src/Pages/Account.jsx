import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import axios from "axios";
import AccountVideos from "./AccountVideos";
import { useNavigate } from "react-router-dom";
import AccountThoughts from "./AccountThoughts";

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
      const res = await axios.get("http://localhost:8000/api/v1/tweet/user/thoughts", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setThoughts(res.data.data)
      console.log(thoughts)

    } catch (error) {
      console.log(error.response.data.message || "Unable to fetch the thoughts at the moment")
    }
  };
  const handleCommentSearch = () => {
    setselect(3);
    console.log(select);
  };

  return (
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
          <h1>You are not logged in your account</h1>
          <div className="btn">
            <li>
              <button
                onClick={() => navigate("/users/login")}
                className="w-full px-4 py-2 mt-4 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/users/register")}
                className="w-full px-4 py-2 mt-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
              >
                Signup
              </button>
            </li>
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

          {select === 1 ? (
            <AccountVideos videos={videos} />
          ) : (
            <div className="btn">
              <h1>404 not found: Unable to fetch the videos at the moment</h1>
            </div>
          )}
          {select === 2 ? (
            <AccountThoughts thoughts={thoughts} />
          ) : (
            <div className="btn">
              <h1>404 not found: Unable to fetch the hot-thoughts at the moment</h1>
            </div>
          )}
        </main>
      )}

      <BottomNav />
    </div>
  );
};

export default Account;
