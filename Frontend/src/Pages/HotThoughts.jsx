import React, { useState, useEffect } from "react";
import { MdForum } from "react-icons/md";
import axios from "axios";
import { GoHeart } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import '../CSS/App.css'


const HotThoughts = () => {
  const [thoughtMessage, setThoughtMessage] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();

  const isMobileLocation = location.pathname === "/hot-thoughts";

  const getAllThoughts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/tweet/messages",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(res);
      setThoughtMessage(res.data.message || "Data fetched successfully");
      setThoughts(res.data.data.thoughts);
      console.log(res.data);
      console.log("check 2");
    } catch (error) {
      setThoughtMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("button clicked");
      const res = await axios.post(
        "http://localhost:8000/api/v1/tweet/say",
        { content },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || "Thought published");
      console.log(message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to publish thought");
      console.log(message);
    } finally {
      setContent("");
      setRefresh((prev) => !prev);
    }
  };
  useEffect(() => {
    getAllThoughts();
  }, [refresh]);

  return (
    <>
      <aside
        className={`${
          isMobileLocation
            ? "mx-auto flex flex-col h-screen p-4 z-40 pt-6 w-full"
            : "hidden h-screen bg-white shadow-lg p-4 z-40 pt-20 lg:flex flex-col fixed top-0 right-0 w-[25vw]"
        }`}
      >
        <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
          <MdForum size={22} /> Hot Thoughts
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
          {thoughts.map((thought, idx) => (
            <div
              key={thought._id || idx}
              className="border-b pb-2 mb-2 bg-gray-100 shadow-md rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <img
                  className="w-10 h-10 rounded-full border border-gray-300"
                  src={thought.owner.avtar}
                  alt={thought.owner.username}
                />
                <span className="font-semibold text-black">
                  {thought.owner.username}
                </span>
              </div>
              <div className="font-medium text-gray-800 mt-2">
                {thought.content}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600 text-sm">
                  {new Date(thought.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 text-red-500">
                    <GoHeart size={18} />
                    <p>{thought.like}</p>
                  </span>
                  <RiDeleteBin6Line
                    size={20}
                    className="text-gray-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="items-center ml-2">
          <div className="flex relative w-full md:w-72">
            <input
              type="text"
              placeholder="What's in your mind"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border font-bold text-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:font-bold placeholder:text-gray-500 pl-4"
            />
            <button
              className="mx-3 bg-purple-600 hover:bg-purple-700 text-white font-medium  py-2 px-4 rounded-3xl shadow-md transition duration-300"
              type="submit"
            >
              Publish
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default HotThoughts;
