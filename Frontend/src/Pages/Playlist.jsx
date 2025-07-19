import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { useDarkMode } from "../DarkModeContext";
import LastFoot from "./LastFoot";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Playlist = () => {
  const [search, setSearch] = useState("");
  const [playlistStat, setplaylistStat] = useState(false);
  const [createPlaylistVisible, setcreatePlaylistVisible] = useState(false);
  const { isDarkModeOn } = useDarkMode();
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const [playlists, setPlaylists] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [playlistForm, setplaylistForm] = useState({
    name: "",
    description: "",
  });
  const inputField = `
    w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2
    ${
      isDarkModeOn
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-gray-500"
        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
    }
  `;

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic
  };

  useEffect(() => {
    const handleGetPlaylist = async () => {
      try {
        const res = await axios.get(`${baseURL}/playlist/user-playlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPlaylists(res.data.data.playlist);
        console.log(res.data.data.playlist);
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
    };

    handleGetPlaylist();
  }, [playlistStat]);
  
  const handleDelete = async (playlistId) => {
    try {
      alert("You are about to delete the playlist")
      const res = await axios.delete(`${baseURL}/playlist/${playlistId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Playlist deleted", {
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
        toast.error("Unable to delete plylist", {
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


  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("name", playlistForm.name);
    formdata.append("description", playlistForm.description);
    try {
      const res = await axios.post(`${baseURL}/playlist`, formdata, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setplaylistStat((prev) => !prev);
      toast.success("Playlist created successfully", {
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
      toast.error("Unable to create playlist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } finally {
      setcreatePlaylistVisible(false);
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setplaylistForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden select-none 
    ${
      isDarkModeOn
        ? "bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#232323]"
        : "bg-gradient-to-br from-blue-100 via-white to-purple-200"
    }`}
    >
      <ToastContainer theme={isDarkModeOn ? "dark" : "light"} />

      <TopBar
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

      <Sidebar />

      {/* Main Content */}
      <main
        className={`flex-grow pt-24 px-4 pb-24
        md:ml-[15.5vw]
        ${
          isDarkModeOn
            ? "bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#232323] text-white"
            : "bg-gradient-to-br from-blue-100 via-white to-purple-200 text-gray-800"
        }`}
      >
        {playlists.map((pl) => (
          <div
            key={pl._id}
            className={`relative p-6 rounded-lg shadow-md transition-transform
      hover:shadow-lg hover:scale-105 cursor-pointer
      ${isDarkModeOn ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}
            onClick={() => navigate(`/playlist/${pl.name}/${pl._id}`)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(pl._id);
              }}
              className={`absolute top-3 right-3 p-1 rounded-full
        hover:bg-red-100 dark:hover:bg-red-900 transition`}
            >
              <FaTrashAlt
                className={`text-lg ${
                  isDarkModeOn ? "text-red-400" : "text-red-600"
                }`}
              />
            </button>

            <h3 className="text-xl font-semibold mb-2">{pl.name}</h3>
            {pl.description && <p className="text-sm mb-4">{pl.description}</p>}
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">
              Explore
            </button>
          </div>
        ))}
      </main>

      <footer
        className={`sticky bottom-0 p-4
        md:ml-[15.5vw]
        ${
          isDarkModeOn ? "bg-[#1A1A1A] text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <LastFoot />
      </footer>

      {/* create playlist window */}
      {createPlaylistVisible && (
        <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold">
                Create Playlist
              </label>
              <label htmlFor="title">
                Title:
                <input
                  type="text"
                  onChange={(e) => handleChange(e)}
                  value={playlistForm.name}
                  name="name"
                  required
                  id="name"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label htmlFor="description">
                Description:
                <textarea
                  name="description"
                  value={playlistForm.description}
                  onChange={(e) => handleChange(e)}
                  required
                  placeholder="Enter playlist description"
                  className={`${inputField} resize-none h-24`}
                />
              </label>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setcreatePlaylistVisible(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Playlist;
