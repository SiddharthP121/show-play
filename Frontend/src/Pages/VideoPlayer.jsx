import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoPlayer = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getVideo = async () => {
      try {
        const res = await axios.get(`${baseURL}/videos/${videoId}`);
        setVideo(res.data.data.video);
        console.log(res.data.data.video);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    if (videoId) getVideo();
  }, []);

  return (
    <div>
     
        <video src={video.videoFile} controls style={{ width: "100%" }} />
     
    </div>
  );
};

export default VideoPlayer;
