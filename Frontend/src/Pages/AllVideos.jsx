import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "../DarkModeContext";
import { useNavigate } from "react-router-dom";

const AllVideos = ({ searchResults }) => {
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const navigate = useNavigate();
  const { isDarkModeOn } = useDarkMode();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hoverIndex, setHoverIndex] = useState(null);

  const truncateText = (text, limit) =>
    text?.length > limit ? text.slice(0, limit) + " ..." : text || "";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${baseURL}/videos`);
        setVideos(response.data.data.video);
        setMessage(response.data.message || "Videos fetched successfully");
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    if (searchResults) {
      setVideos(searchResults);
      setLoading(false);
    } else {
      fetchVideos();
    }
  }, [searchResults]);

  return (
    <div className="w-full flex justify-center px-4 md:px-0">
      <div className="w-full max-w-4xl pt-2 pb-24">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 opacity-30" />
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-600 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {videos.length === 0 ? (
              <p className="text-center text-sm text-gray-600 mt-8">
                {message || "No videos found"}
              </p>
            ) : (
              videos.map((video, index) => (
                <div
                  key={video._id || index}
                  className={`w-full border rounded-2xl shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 transition hover:shadow-xl cursor-pointer ${
                    isDarkModeOn
                      ? "bg-[#252525] text-[#F1F1F1] border-[#2A2A2A]"
                      : "bg-white text-[#1A1A1A] border-[#E0E0E0]"
                  }`}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => navigate(`video/watch/${video._id}`)}
                >
                  
                  <div className="flex items-center justify-center w-full md:w-56 h-40 rounded-xl bg-gray-100 overflow-hidden">
                    {hoverIndex === index && video.videoFile ? (
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

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className={`text-lg md:text-2xl font-semibold mb-1 ${
                          isDarkModeOn ? "text-gray-200" : "text-black"
                        }`}
                      >
                        {truncateText(video.title, 60)}
                      </h3>
                      <p
                        className={`text-sm md:text-base mb-2 ${
                          isDarkModeOn ? "text-gray-400" : "text-blue-400"
                        }`}
                      >
                        {truncateText(video.description, 150)}
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllVideos;