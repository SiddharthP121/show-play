import React, { useState, useEffect } from "react";
import { GoHeart } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import axios from "axios";
const baseURL = import.meta.env.DEFAULT_URL;

import { useDarkMode } from "../DarkModeContext";

const AccountThoughts = ({ thoughts, setThoughts }) => {
  const token = localStorage.getItem("token");

  const [editId, seteditId] = useState(null);
  const [thoughtContent, setThoughtContent] = useState(null);
  const { isDarkModeOn } = useDarkMode();
  const handleSubmit = async (e, editId) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${baseURL}/tweet/${editId}`,
        { content: thoughtContent },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setThoughts(res.data.data);
    } catch (error) {
      console.log(
        error?.response?.data?.message || "Unable to edit the thought"
      );
    } finally {
      seteditId(null);
      setThoughtContent(null);
      console.log(thoughts);
    }
  };
  const handleChange = (e) => {
    setThoughtContent(e.target.value);
  };

  const handleDelete = async (thoughtId) => {
    try {
      const res = await axios.delete(`${baseURL}/tweet/${thoughtId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setThoughts(res.data.data);
    } catch (error) {
      console.log("Unable to delete the thought at the moment");
    }
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(thoughts) &&
        thoughts.map((thought) => (
          <div
            key={thought._id}
            className={`
      shadow-lg rounded-2xl p-4 hover:shadow-2xl transition-shadow duration-300 
      flex flex-col items-end justify-start
      ${
        isDarkModeOn
          ? "bg-[#1d1b1b] text-[#F1F1F1] border-l border-[#323030]"
          : "bg-white text-[#1A1A1A] border-[#c3bebe]"
      }`}
          >
            <div className="w-full text-left">
              <p
                className={`${
                  isDarkModeOn ? "text-gray-350" : "text-red-950"
                } text-base mb-3`}
              >
                {thought.content}
              </p>
              <p
                className={`text-sm ${
                  isDarkModeOn ? "text-gray-200" : "text-black"
                }`}
              >
                By {thought.owner.username}
              </p>
              <div className=" flex mt-3 justify-between">
                <p className="text-xs text-gray-400">
                  {new Date().toLocaleDateString()}
                </p>
                {thought.updatedAt && (
                  <p className="text-xs text-gray-400">
                    Last Update: {new Date(thought.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 w-full">
              <div className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer">
                <GoHeart className="text-xl" />
                <span>{thought.likes}</span>
              </div>

              <div className="flex gap-4 text-gray-500">
                <button
                  onClick={() => {
                    seteditId(thought._id);
                    setThoughtContent(thought.content);
                  }}
                >
                  <FiEdit2 className="text-lg hover:text-blue-600 cursor-pointer transition-colors" />
                </button>
                <button>
                  <RiDeleteBin6Line
                    onClick={() => handleDelete(thought._id)}
                    className="text-lg hover:text-red-600 cursor-pointer transition-colors"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      {editId && thoughtContent && (
        <>
          {/* Blurred & tinted full-screen overlay */}
          <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50" />

          {/* Centered modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md pointer-events-auto">
              <form onSubmit={(e) => handleSubmit(e, editId)}>
                <label className="block mb-2 text-gray-700">Edit Thought</label>
                <input
                  name="content"
                  value={thoughtContent}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      setThoughtContent(null), seteditId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountThoughts;
