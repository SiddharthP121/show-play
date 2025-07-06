import React, { useState, useEffect } from "react";
import { FaHeart, FaCommentAlt, FaShare, FaPlusSquare } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";

const VideoPlayer = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const { videoId } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${baseURL}/videos/${videoId}`);
        setVideo(res.data.data.video);
      } catch (err) {
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading)
    return <div className="p-8 text-center">Loading video...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!video) return <div className="p-8 text-center">No video found.</div>;

  const videoUrl = video.videoFile?.replace(/^http:\/\//, "https://");

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-2 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
      {/* Main Video & Info */}
      <div className="w-full md:w-3/4 max-w-4xl mx-auto md:mx-0 bg-white rounded-xl shadow-lg p-3 md:p-8 mb-8 md:mb-0">
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg mb-4"
          poster={video.thumbnail}
        />

        {/* Action Icons */}
        <div className="flex gap-6 md:gap-8 mb-6 items-center justify-center md:justify-start">
          <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
            <FaHeart size={22} />
            <span className="hidden md:inline">Like</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <FaCommentAlt size={22} />
            <span className="hidden md:inline">Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <FaShare size={22} />
            <span className="hidden md:inline">Share</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <FaPlusSquare size={22} />
            <span className="hidden md:inline">Add to Playlist</span>
          </button>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-4 mb-6">
          <img
            className="w-12 h-12 rounded-full border border-gray-300 object-cover"
            src={video.owner.avtar}
            alt={video.owner.username}
          />
          <div className="flex-1">
            <p className="font-semibold">{video.owner.username}</p>
            <p className="text-gray-500 text-sm">{video.owner.fullname}</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            Subscribe
          </button>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h2>
        <p className="text-gray-700 mb-2">{video.description}</p>
      </div>

      {/* Comments Section */}
      <div className="comments w-full md:w-1/4 order-last md:order-none bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="font-bold text-xl md:text-2xl mb-4">Comments</h2>
        {/* Comments content here */}
      </div>
    </div>
  );
};

export default VideoPlayer;
