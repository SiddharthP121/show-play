import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDarkMode } from "../DarkModeContext";

const VideoPlaylist = () => {
  const { playlistId } = useParams();
  const [loading, setLoading] = useState(true);
  const { isDarkModeOn } = useDarkMode();
  const [videos, setVideos] = useState([]);
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [playingIdx, setPlayingIdx] = useState(null);
  const token = localStorage.getItem("token");
  const playlistName = null
  const playlistDescription = null
  useEffect(() => {
    const getPlaylistVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/playlist/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("API response:", res.data);
        const videosArr = res?.data?.data?.playlist?.videos;
        playlistName = res?.data?.data?.playlist.name;
        playlistDescription = res?.data?.data?.playlist.description;
        setVideos(Array.isArray(videosArr) ? videosArr : []);
        setMessage("");
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("Unable to fetch playlist");
        toast.error("Unable to fetch playlist", {
          theme: isDarkModeOn ? "dark" : "light",
        });
      } finally {
        setLoading(false);
      }
    };

    getPlaylistVideos();
  }, [playlistId, baseURL, token, isDarkModeOn]);

  const truncateWords = (str, maxChars) => {
    if (!str) return "";
    return str.length <= maxChars ? str : str.slice(0, maxChars) + " ...";
  };

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div className="w-full max-w-4xl pt-2 pb-24">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen bg-transparent">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 opacity-30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-600 animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h1
              className={`text-3xl md:text-4xl font-bold leading-tight ${
                isDarkModeOn ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {playlistName}
            </h1>
            <p
              className={`text-base md:text-lg max-w-prose leading-7 ${
                isDarkModeOn ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {playlistDescription}
            </p>
            <hr
              className={`border-t-2 ${
                isDarkModeOn ? "border-gray-700" : "border-gray-300"
              } w-full`}
            />
            {videos.map((video, idx) => (
              <div
                key={video._id || idx}
                className={`w-full border rounded-2xl shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-200 hover:shadow-xl cursor-pointer ${
                  isDarkModeOn
                    ? "bg-gray-800 text-gray-100 border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                }`}
                onMouseEnter={() => setPlayingIdx(idx)}
                onMouseLeave={() => setPlayingIdx(null)}
                onClick={() => navigate(`/video/watch/${video._id}`)}
              >
                {/* Thumbnail / Video Preview */}
                <div
                  className={`flex items-center justify-center w-full md:w-56 h-40 rounded-xl overflow-hidden ${
                    isDarkModeOn ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {playingIdx === idx && video.videoFile ? (
                    <video
                      src={video.videoFile}
                      muted
                      autoPlay
                      className="object-cover w-full h-full rounded-xl"
                    />
                  ) : video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-full rounded-xl hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400">No Thumbnail</span>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`text-lg md:text-2xl font-semibold mb-1 ${
                        isDarkModeOn ? "text-gray-200" : "text-black"
                      }`}
                    >
                      {truncateWords(video.title, 60)}
                    </h3>
                    <p
                      className={`text-sm md:text-base mb-2 ${
                        isDarkModeOn ? "text-gray-400" : "text-blue-400"
                      }`}
                    >
                      {truncateWords(video.description, 150)}
                    </p>
                    <p
                      className={`text-xs md:text-sm ${
                        isDarkModeOn ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {video.owner?.username}
                    </p>
                  </div>

                  <div
                    className={`flex gap-4 text-xs md:text-sm mt-2 ${
                      isDarkModeOn ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <p>{video.views || 0} views</p>
                    <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Show message if any */}
            {message && videos.length === 0 && (
              <p className="text-center text-sm mt-8 text-gray-500 dark:text-gray-400">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlaylist;
