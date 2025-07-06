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
        // Adjust the path if your backend is different
        setVideo(res.data.data.video);
      } catch (err) {
        setError("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading) return <div>Loading video...</div>;
  if (error) return <div>{error}</div>;
  if (!video) return <div>No video found.</div>;

  // Ensure HTTPS for videoFile
  const videoUrl = video.videoFile?.replace(/^http:\/\//, "https://");

  return (
    <div className="flex">
      <div className="w-[100%] max-w-275">
        <video
          src={videoUrl}
          controls
          style={{ width: "100%", maxWidth: "1100px" }}
          poster={video.thumbnail}
        />

        <div className="flex gap-6 my-4 items-center">
          <button className="flex items-center gap-2 hover:text-blue-500">
            <FaHeart />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <FaCommentAlt />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <FaShare />
            <span>Share</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <FaPlusSquare />
            <span>Add to Playlist</span>
          </button>
        </div>

        <button class="button">Subscribe</button>
        <div className="owner flex">
          <img
            className="w-10 h-10 rounded-full border border-gray-300"
            src={video.owner.avtar}
            alt=""
          />
          <div>
            <p>{video.owner.username}</p>
            <p>{video.owner.fullname}</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold">{video.title}</h2>
        <p className="p-2">{video.description}</p>
      </div>

      <div className="comments">
        <h2 className="font-bold text-2xl">Comments</h2>
      </div>
    </div>
  );
};

export default VideoPlayer;
