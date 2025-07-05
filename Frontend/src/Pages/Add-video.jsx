import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import { ToastContainer, toast } from "react-toastify";

const AddVideo = () => {
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const { isDarkModeOn } = useDarkMode();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: null,
    videoFile: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));

    try {
      await axios.post(`${baseURL}/videos`, data, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Video uploaded successfully ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
      navigate("/");
    } catch {
      toast.error("Unable to upload video", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const fileInputClasses = `
    block w-full text-sm ${isDarkModeOn ? "text-gray-300" : "text-gray-600"}
    file:mr-4 file:py-2 file:px-4
    file:rounded-lg file:border
    ${
      isDarkModeOn
        ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
        : "file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
    }
    cursor-pointer
  `;

  const bgPanel = isDarkModeOn ? "bg-gray-800" : "bg-white";
  const bgPage = isDarkModeOn
    ? "bg-gradient-to-br from-gray-700 to-gray-900"
    : "bg-gradient-to-br from-blue-100 to-purple-200";
  const textLabel = isDarkModeOn ? "text-gray-300" : "text-gray-700";
  const inputField = `
    w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2
    ${
      isDarkModeOn
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-gray-500"
        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
    }
  `;
  const btnClasses = `
    w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors duration-200
    bg-purple-600 hover:${
      isDarkModeOn ? "bg-purple-500" : "bg-purple-700"
    } text-white disabled:opacity-50
  `;

  return (
    <div
      className={`select-none min-h-screen flex items-center justify-center px-4 py-8 ${bgPage}`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl shadow-lg p-8 space-y-6 transition-colors duration-300 ${bgPanel}`}
      >
        <h1
          className={`text-3xl font-extrabold text-center ${
            isDarkModeOn ? "text-gray-100" : "text-purple-700"
          }`}
        >
          Add a New Video
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1 ${textLabel}`}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter video title"
              className={inputField}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textLabel}`}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Enter video description"
              className={`${inputField} resize-none h-24`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textLabel}`}>
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              name="thumbnail"
              onChange={handleChange}
              required
              className={fileInputClasses}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textLabel}`}>
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              name="videoFile"
              onChange={handleChange}
              required
              className={fileInputClasses}
            />
          </div>

          <button type="submit" disabled={loading} className={btnClasses}>
            {loading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  fill="currentColor"
                  className="opacity-75"
                />
              </svg>
            )}
            {loading ? "Publishing..." : "Publish Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;
