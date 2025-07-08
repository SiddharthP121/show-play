import React, { useState, useEffect } from "react";
import { FaHeart, FaCommentAlt, FaShare, FaPlusSquare } from "react-icons/fa";
import axios from "axios";
import { GoHeart } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";

const VideoPlayer = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const { videoId } = useParams();
  const [comments, setComments] = useState([]);
  const [commentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [likeChanged, setLikeChanged] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const { isDarkModeOn } = useDarkMode();

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axios.get(`${baseURL}/comment/${videoId}`);
        setComments(res.data.data);
      } catch (error) {
        setMessage(error.response.data.message || "Unable to fetch comments");
      }
    };

    getAllComments();
  }, [commentVisible, videoId]);

  const toggleLike = async () => {};

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
  }, [videoId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${baseURL}/comment/${videoId}`,
        { comment },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment("");
      toast.success("Comment Published Successfully", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
      setCommentVisible(false)
    } catch (error) {
      setComment("");
      toast.error("Unable to publish comment", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
      setCommentVisible(false)
    }
  };
  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev);
      setVideo((prev) => ({
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
    } catch (error) {
      setIsLiked((prev) => !prev);
      setVideo((prev) => ({
        ...prev,
        likes: isLiked ? prev.likes + 1 : prev.likes - 1,
      }));
      console.log("Unable to like the video");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500 opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-purple-600 animate-spin"></div>
        </div>
      </div>
    );
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
            <span
              className={`hidden md:inline ${isLiked ? "text-red-400" : ""}`}
            >
              <p>{video.likes} Likes</p>
            </span>
          </button>
          <button
            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            onClick={() => setCommentVisible(true)}
          >
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

      {commentVisible && (
        <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <label className="block text-gray-700 text-lg font-semibold">
              Add a comment{" "}
            </label>
            <form onSubmit={handleCommentSubmit}>
              <input
                className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Comment"
                name="comment"
                value={comment}
                id="comment"
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit">Publish</button>
            </form>
          </div>
        </div>
      )}

      <div className="comments h-[90vh] w-full md:w-[30%] order-last md:order-none bg-white rounded-xl shadow-lg p-4 md:p-6 md:sticky md:top-8">
        <h2 className="font-bold text-xl md:text-2xl mb-4">Comments</h2>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              className="flex-1 overflow-y-auto pr-2 custom-scroll"
              key={comment._id}
            >
              <div
                className={`border-b pb-2 mb-2 ${
                  isDarkModeOn
                    ? "bg-[#1d1b1b] text-[#F1F1F1] border-l border-[#323030]"
                    : "bg-white text-[#1A1A1A] border-[#c3bebe] shadow-lg"
                } shadow-md rounded-lg p-3`}
              >
                <div className="flex items-center gap-2">
                  <img
                    className="w-10 h-10 rounded-full border border-gray-300"
                    src={comment.owner.avtar}
                    alt={comment.owner.username}
                  />
                  <span
                    className={`font-semibold ${
                      isDarkModeOn ? "text-gray-200" : "text-black"
                    } mb-1`}
                  >
                    {comment.owner.username}
                  </span>
                </div>
                <div
                  className={` ${
                    isDarkModeOn ? "text-gray-350" : "text-red-950"
                  } mt-2`}
                >
                  {comment.content}
                </div>
                <div className="flex justify-between mt-2">
                  <span className=" mt-1.5 text-slate-500 font-medium text-xs">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleLike()}
                      className={`flex cursor-pointer items-center space-x-1 ${
                        isDarkModeOn ? "text-white" : "text-red-400 "
                      }`}
                    >
                      <GoHeart size={18} />
                      <p>{comment.likes}</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
