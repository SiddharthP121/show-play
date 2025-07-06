import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

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
    <div>
      <h2>{video.title}</h2>
      <video
        src={videoUrl}
        controls
        style={{ width: "100%", maxWidth: "800px" }}
        poster={video.thumbnail}
      />
      <p>{video.description}</p>
    </div>
  );
};

export default VideoPlayer;
