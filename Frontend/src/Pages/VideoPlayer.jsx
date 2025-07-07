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
  const [likeChanged, setLikeChanged] = useState(false);
  const [isLiked, setIsLiked] = useState(false)
  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${baseURL}/videos/${videoId}`);
        setVideo(res.data.data.video);
        setIsLiked(res.data.data.isLiked);
      } catch (err) {
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]); // Only fetch when videoId changes

  const handleLike = async () => {
    try {
      // Optimistically update UI
      setIsLiked(prev => !prev);
      setVideo(prev => ({
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1,
      }));

      await axios.post(
        `${baseURL}/likes/toggle/v/${videoId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // No need to re-fetch the video!
    } catch (error) {
      // Revert UI if error
      setIsLiked(prev => !prev);
      setVideo(prev => ({
        ...prev,
        likes: isLiked ? prev.likes + 1 : prev.likes - 1,
      }));
      console.log("Unable to like the video");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading video...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!video) return <div className="p-8 text-center">No video found.</div>;

  const videoUrl = video.videoFile?.replace(/^http:\/\//, "https://");

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-6 px-2 md:px-8 py-6 md:py-10 bg-gray-50 min-h-screen">
      {/* Video Section */}
      <div className="w-full md:w-[70%] mx-auto md:mx-0 bg-white rounded-xl p-3 md:p-8 mb-8 md:mb-0">
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg mb-4"
          poster={video.thumbnail}
        />

        <div className="flex gap-6 md:gap-8 mb-6 items-center justify-around md:justify-around">
          <button
            className="flex items-center gap-2 hover:text-red-500 transition-colors"
            onClick={handleLike}
          >
            <FaHeart size={22} color={isLiked ? "#ef4444" : undefined} />
            <span className={`hidden md:inline ${isLiked ? "text-red-400" : ""}`}>
              <p>{video.likes} Likes</p>
            </span>
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
          <button className="button">Subscribe</button>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h2>
        <p className="text-gray-700 mb-2">{video.description}</p>
      </div>

      {/* Comments Section */}
      <div className="comments h-[90vh] w-full md:w-[30%] order-last md:order-none bg-white rounded-xl shadow-lg p-4 md:p-6 md:sticky md:top-8">
        <h2 className="font-bold text-xl md:text-2xl mb-4">Comments</h2>
        {/* Comments content here */}
      </div>
    </div>
  );
};

export default VideoPlayer;
