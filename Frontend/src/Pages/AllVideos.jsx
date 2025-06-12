import React, { useState, useEffect } from "react";
import axios from "axios";

const AllVideos = () => {
  const baseURL = "http://localhost:8000/api/v1/videos";
  const params = {
    page: 1,
    limit: 10,
    query: "search term",
    sortBy: "createdAt",
    sortType: "d",
    userId: "",
  };

  const truncateWords = (str, maxChars) => {
   if(!str) return ""
    return str.length <= maxChars ? str : str.slice(0, maxChars) + " ..."
  }
  
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [playingIdx, setPlayingIdx] = useState(null);

  useEffect(() => {
    const getAllVideosToHome = async () => {
      try {
        const res = await axios.get(baseURL);
        setVideos(res.data.data.video);
        message(res.data.message || "Videos fetched successfully")
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Unable to fetch the videos"
        );
      }
    };
    getAllVideosToHome();
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center md:ml-56 min-h-screen">
        <div className="card-container px-2 pt-2 pb-20 md:px-2 md:pb-0 w-full flex flex-col items-center justify-center">
          {videos.map((video, idx) => (
            <div
              key={video._id || idx}
              className="w-full max-w-2xl border rounded-2xl shadow-lg bg-white p-3 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6 my-4 cursor-pointer"
              onMouseEnter={() => setPlayingIdx(idx)}
              onMouseLeave={() => setPlayingIdx(null)}
            >
              <div className="thumbnail border rounded-xl bg-gray-100 flex items-center justify-center w-full h-40 md:w-56 md:h-40 mb-3 md:mb-0 overflow-hidden">
                {playingIdx === idx && video.videoFile ? (
                  <video
                    src={video.videoFile}
                    controls
                    autoPlay
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <span className="text-gray-400">No Thumbnail</span>
                )}
              </div>
              <div className="videoInfo flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="title text-lg md:text-2xl font-bold text-purple-700 mb-1">
                    {truncateWords(video.title, 30)}
                  </h3>
                  <p className="description text-sm md:text-base text-gray-700 mb-2">
                    {truncateWords(video.description, 100)}
                  </p>
                  <p className="owner text-xs md:text-sm text-gray-500 mb-2">
                    {video.owner?.username}
                  </p>
                </div>
                <div className="generalInfo flex gap-4 text-xs md:text-sm text-gray-500">
                  <p className="totalViews">{video.views || 0} Views</p>
                  <p className="createdAt">
                    {new Date(video.createdAt).toLocaleDateString()}{" "}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default AllVideos;
