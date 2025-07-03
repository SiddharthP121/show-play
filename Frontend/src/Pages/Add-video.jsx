import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add_video = () => {
  const baseURL = import.meta.env.DEFAULT_URL;
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: null,
    videoFile: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // <-- loader state
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((form) => ({
      ...form,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const res = await axios.post(`${baseURL}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMessage(res.data.message || "Video uploaded successfully");
      alert("video uploaded");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data.message || "unable to upload the video");
      alert("unable to upload video");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Add a Video
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              placeholder="Enter Title"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              placeholder="Enter Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              name="thumbnail"
              id="thumbnail"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="video"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Video
            </label>
            <input
              type="file"
              accept="video/*"
              name="videoFile"
              id="video"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Publishing...
              </span>
            ) : (
              "Publish Video"
            )}
          </button>
          {message && (
            <div className="text-center text-sm mt-2 text-red-500">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Add_video;
