import React, { useState, useEffect } from "react";
import axios from "axios";

const Playlist = () => {
  const token = localStorage.getItem("token");
  const [watchHistory, setWatchHistory] = useState([]);
  const [message, setMessage] = useState();

  useEffect(() => {
    const getWatchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/users/history",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWatchHistory(res.data.data);
        setMessage(res.data.message);
        console.log(watchHistory);
        console.log(message);
      } catch (error) {
        setMessage(
          error?.response?.data?.message || "Unable to fetch watch-history"
        );
        console.log(message);
      }
    };
    getWatchHistory();
  }, []);

  return
   <>
   
   </>;
};

export default Playlist;
