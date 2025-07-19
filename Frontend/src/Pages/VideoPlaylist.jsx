import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDarkMode } from "../DarkModeContext";

const VideoPlaylist = () => {
  const playListId = useParams();
  const [loading, setLoading] = useState(true);
  const { isDarkModeOn } = useDarkMode();
  const [videos, setVideos] = useState([]);
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const getPlaylistVideos = async () => {
      try {
        res = await axios.get(`${baseURL}/playlist/${playListId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(res.data.data.playlist);
      } catch (error) {
        toast.error("Unable to fetch playlist", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkModeOn ? "dark" : "light",
        });
      }
    };

    getPlaylistVideos;
  }, []);

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
            {videos.map((video, idx) => (
              <div
                key={video._id || idx}
                className={` w-full border rounded-2xl shadow-md p-4 md:p-6  flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-200 hover:shadow-xl cursor-pointer  ${
                  isDarkModeOn
                    ? "bg-[#252525] text-[#F1F1F1] border border-[#2A2A2A]"
                    : "bg-white text-[#1A1A1A] border border-[#E0E0E0]"
                }
  `}
                onMouseEnter={() => setPlayingIdx(idx)}
                onMouseLeave={() => setPlayingIdx(null)}
                onClick={() => navigate(`video/watch/${video._id}`)}
              >
                {/* Thumbnail / Video Preview */}
                <div className="flex items-center justify-center w-full md:w-56 h-40 rounded-xl bg-gray-100 overflow-hidden">
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
                      className={`text-lg md:text-2xl font-semibold ${
                        isDarkModeOn ? "text-gray-200" : "text-black"
                      } mb-1`}
                    >
                      {truncateWords(video.title, 60)}
                    </h3>
                    <p
                      className={`text-sm md:text-base ${
                        isDarkModeOn ? "text-gray-400" : "text-blue-400"
                      } mb-2`}
                    >
                      {truncateWords(video.description, 150)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {video.owner?.username}
                    </p>
                  </div>

                  <div className="flex gap-4 text-xs md:text-sm text-gray-500 mt-2">
                    <p>{video.views || 0} views</p>
                    <p>{new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Show message if any */}
            {message && videos.length === 0 && (
              <p className="text-center text-sm text-gray-600 mt-8">
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
