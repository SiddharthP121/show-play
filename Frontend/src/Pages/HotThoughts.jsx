import React, { useState, useEffect } from "react";
import { MdForum } from "react-icons/md";
import axios from "axios";
import { GoHeart } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import "../CSS/App.css";
import { useNavigate } from "react-router-dom";

const HotThoughts = () => {
  const [thoughtMessage, setThoughtMessage] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isMobileLocation = location.pathname === "/hot-thoughts";
  const navigate = useNavigate()

  const messageLimit = (string, maxWords) => {
    if (string.length > maxWords) {
      alert("Maximum words limit reached")
      return string.slice(0, maxWords);
    }
    return string;
  }
  

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
    } catch (error) {
      setThoughtMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  
  const toggleLike = async (thoughtId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/likes/toggle/t/${thoughtId}`,{},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        
      )
      const updatedThought = res.data.data.thought;
      console.log(updatedThought)
      setThoughts((thoughts) => 
        thoughts.map((thought) => 
          thought._id === thoughtId?{...thought, likes: updatedThought.like}: thought
        
        )
      
      )
      setRefresh((prev) => !prev)
    } catch (error) {
          console.error("Error toggling like:", error?.response?.data?.message || error.message);

    }
  }

  

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
        {token?(

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
                  <button onClick={()=>toggleLike(thought._id)} className="flex cursor-pointer items-center space-x-1 text-red-500">
                    <GoHeart size={18} />
                    <p>{thought.likes}</p>
                  </button>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
        ):(
 <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
           <main>
          <div className="w-full max-w-sm mx-auto mt-10 px-6 py-8 space-y-4">
 <div className="w-full max-w-md mx-auto mt-16 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl px-8 py-10">
  <h1 className="text-center text-lg font-semibold text-black mb-6">
   Login to see cloud statements
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
        </div>        )}

        <form onSubmit={handleSubmit} className="items-center ml-2">
          <div className="flex relative w-full md:w-72">
            <input
              type="text"
              placeholder="What's in your mind"
              name="content"
              value={content}
              onChange={(e) => setContent(messageLimit(e.target.value, 100))}
              className="w-full px-3 py-2 border font-bold text-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:font-bold placeholder:text-gray-500 pl-4"
            />
            <button
              className="mx-3 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium  py-2 px-4 rounded-3xl shadow-md transition duration-300"
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
