import React, { useState, useEffect } from "react";
import { FaHeart, FaCommentAlt, FaShare, FaPlusSquare } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import LastFoot from "./LastFoot";

const VideoPlayer = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [playlists, setPlaylists] = useState([])
  const [playlistVisible, setplaylistVisible] = useState(false)
  const [commentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [message, setMessage] = useState("");
  const { isDarkModeOn } = useDarkMode();
  const { videoId } = useParams();
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axios.get(`${baseURL}/comment/${videoId}`);
        setComments(res.data.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to fetch comments");
      }
    };
    getAllComments();
  }, [commentVisible, videoId]);

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

  const handleGetPlaylist = async () => {
    try {
      const res = await axios.get(`${baseURL}/playlist/user-playlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      })
      setPlaylists(res.data.data.playlists)
      console.log(res.data.data.playlists)
       toast.success("Playlist fetched", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } catch (error) {
       toast.error("Unable to fetch plylist", {
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
  }

  const addVideoToPlaylist = async (playlistId, playlistName) => {
    try {
      const res = await axios.patch(`${baseURL}/playlist/add/${videoId}/${playlistId}`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success(`Video added to ${playlistName}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });

    } catch (error) {
      toast.error("Unable to add video", {
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
    finally{
      setplaylistVisible(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
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
        theme: isDarkModeOn ? "dark" : "light",
      });
      setCommentVisible(false);
    } catch (error) {
      setComment("");
      toast.error("Unable to publish comment", {
        theme: isDarkModeOn ? "dark" : "light",
      });
      setCommentVisible(false);
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

  const toggleCommentLike = async () => {
    // Your implementation for liking a comment
  };

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkModeOn ? "bg-[#121212]" : "bg-white"
        }`}
      >
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
    <>
      <ToastContainer theme={isDarkModeOn ? "dark" : "light"} />

      <div
        className={`flex flex-col min-h-screen ${
          isDarkModeOn ? "bg-[#121212] text-white" : "bg-gray-50 text-black"
        }`}
      >
        <div className="flex flex-col md:flex-row flex-grow gap-8 md:gap-6 px-2 md:px-8 py-6 md:py-10">
          {/* Video Section */}
          <div
            className={`w-full md:w-[70%] mx-auto md:mx-0 rounded-xl p-3 md:p-8 mb-8 md:mb-0 shadow-md ${
              isDarkModeOn ? "bg-[#1e1e1e]" : "bg-white"
            }`}
          >
            <video
              src={videoUrl}
              autoPlay
              controls
              className="w-full rounded-lg mb-4"
              poster={video.thumbnail}
            />

            <div className="flex gap-6 md:gap-8 mb-6 items-center justify-around">
              <button
                className={`flex items-center gap-2 transition-colors ${
                  isDarkModeOn
                    ? "hover:text-red-400"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                <FaHeart size={22} color={isLiked ? "#ef4444" : undefined} />
                <span
                  className={`hidden md:inline ${
                    isLiked ? "text-red-400" : ""
                  }`}
                >
                  <p>{video.likes} Likes</p>
                </span>
              </button>

              <button
                className={`flex items-center gap-2 ${
                  isDarkModeOn ? "hover:text-blue-400" : "hover:text-blue-500"
                }`}
                onClick={() => setCommentVisible(true)}
              >
                <FaCommentAlt size={22} />
                <span className="hidden md:inline">Comment</span>
              </button>

              <button
                className={`flex items-center gap-2 ${
                  isDarkModeOn ? "hover:text-blue-400" : "hover:text-blue-500"
                }`}
              >
                <FaShare size={22} />
                <span className="hidden md:inline">Share</span>
              </button>

              <button
                className={`flex items-center gap-2 ${
                  isDarkModeOn ? "hover:text-blue-400" : "hover:text-blue-500"
                }`}
                onClick={async() => {
                  await handleGetPlaylist(),
                  setplaylistVisible(true)
                }
                 }
              >
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
                <p className="text-gray-500 text-sm">
                  {video.owner.fullname}
                </p>
              </div>
              <button className="button">Subscribe</button>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {video.title}
            </h2>
            <p className="text-gray-700 mb-2">{video.description}</p>
          </div>
          {/* Playlist model */}
          {playlistVisible && (
            <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
              <div
                className={`p-6 rounded-lg shadow-lg w-11/12 max-w-md ${
                  isDarkModeOn
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-white text-black"
                }`}
              >
                {/* back button */}
                <button
                  onClick={() => setplaylistVisible(false)}
                  className={`mb-4 text-sm font-medium rounded px-3 py-1 transition-colors ${
                    isDarkModeOn
                      ? "bg-[#2c2c2c] text-gray-300 hover:bg-[#3a3a3a]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ← Back
                </button>

                <label className="block text-lg font-semibold">
                  Select playlist folder
                </label>
                {/* cards of folders of playlist */}
                 {playlists.map((playlist) => (
  <div
    key={playlist._id}
    onClick={() => addVideoToPlaylist(playlist._id, playlist.name)}
    className={`relative flex items-center gap-4 p-4 rounded-lg shadow-md transition 
      hover:shadow-xl transform hover:scale-105 cursor-pointer
      ${isDarkModeOn
        ? "bg-gray-800 text-gray-100 border border-gray-700"
        : "bg-white text-gray-900 border border-gray-200"
      }`}
  >
    {/* Thumbnail */}
    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
      {playlist.videos?.[0]?.thumbnail ? (
        <img
          src={playlist.videos[0].thumbnail}
          alt={playlist.name}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex w-full h-full items-center justify-center text-gray-500">
          🎵
        </div>
      )}
    </div>

    {/* Playlist Name */}
    <div className="flex-1">
      <h2 className="text-lg font-semibold truncate">{playlist.name}</h2>
    </div>

    {/* Optional chevron icon */}
    <div className="text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
))}


                 
              </div>
            </div>
          )}
          {/* Comment Modal */}
          {commentVisible && (
            <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
              <div
                className={`p-6 rounded-lg shadow-lg w-11/12 max-w-md ${
                  isDarkModeOn
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-white text-black"
                }`}
              >
                <button
                  onClick={() => setCommentVisible(false)}
                  className={`mb-4 text-sm font-medium rounded px-3 py-1 transition-colors ${
                    isDarkModeOn
                      ? "bg-[#2c2c2c] text-gray-300 hover:bg-[#3a3a3a]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ← Back
                </button>

                <label className="block text-lg font-semibold">
                  Add a comment
                </label>
                <form onSubmit={handleCommentSubmit}>
                  <input
                    className={`w-full my-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                      isDarkModeOn
                        ? "bg-[#2c2c2c] text-white border-gray-600 focus:ring-blue-400"
                        : "bg-white text-black border-gray-500 focus:ring-blue-400"
                    }`}
                    type="text"
                    placeholder="Comment"
                    name="comment"
                    value={comment}
                    id="comment"
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    className={`relative cursor-pointer py-3 px-5 md:py-4 md:px-8 text-center font-barlow inline-flex justify-center text-sm md:text-base uppercase ${
                      isDarkModeOn ? "text-white" : "text-white"
                    } rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline ${
                      isDarkModeOn ? "focus:outline-white" : "focus:outline-white"
                    } focus:outline-offset-4 overflow-hidden`}
                  >
                    <span
                      className={`relative z-20 ${
                        isDarkModeOn ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Publish
                    </span>

                    <span
                      className={`absolute left-[-75%] top-0 h-full w-[50%] ${
                        isDarkModeOn ? "bg-white/10" : "bg-white/20"
                      } rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out`}
                    ></span>

                    <span
                      className={`w-1/2 drop-shadow-3xl transition-all duration-300 block ${
                        isDarkModeOn ? "border-gray-600" : "border-[#D4EDF9]"
                      } absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0`}
                    ></span>
                    <span
                      className={`w-1/2 drop-shadow-3xl transition-all duration-300 block ${
                        isDarkModeOn ? "border-gray-600" : "border-[#D4EDF9]"
                      } absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0`}
                    ></span>
                    <span
                      className={`w-1/2 drop-shadow-3xl transition-all duration-300 block ${
                        isDarkModeOn ? "border-gray-600" : "border-[#D4EDF9]"
                      } absolute h-[60%] group-hover=h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0`}
                    ></span>
                    <span
                      className={`w-1/2 drop-shadow-3xl transition-all duration-300 block ${
                        isDarkModeOn ? "border-gray-600" : "border-[#D4EDF9]"
                      } absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0`}
                    ></span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Comments Sidebar */}
          <div
            className={`flex-1 overflow-y-auto pr-2 custom-scroll comments h-[90vh] w-full md:w-[30%] order-last md:order-none rounded-xl shadow-lg p-4 md:p-6 md:sticky md:top-8 ${
              isDarkModeOn ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="font-bold text-xl md:text-2xl mb-4">
              Comments
            </h2>
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="mb-4">
                  <div
                    className={`border-b pb-2 rounded-lg p-3 ${
                      isDarkModeOn
                        ? "bg-[#1d1b1b] text-[#F1F1F1] border-l border-[#323030]"
                        : "bg-white text-[#1A1A1A] border-[#c3bebe] shadow-lg"
                    } shadow-md`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className="w-10 h-10 rounded-full border border-gray-300"
                        src={comment.owner.avtar}
                        alt={comment.owner.username}
                      />
                      <span className="font-semibold">
                        {comment.owner.username}
                      </span>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-slate-500 font-medium text-xs">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => toggleCommentLike()}
                        className={`flex items-center space-x-1 ${
                          isDarkModeOn ? "text-white" : "text-red-400"
                        }`}
                      >
                        <GoHeart size={18} />
                        <p>{comment.likes}</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full flex justify-center p-4">
          <LastFoot />
        </footer>
      </div>
    </>
  );
};

export default VideoPlayer;
