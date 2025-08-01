import React,{useState} from 'react'
import { useDarkMode } from '../DarkModeContext';

const AccountVideos = ({videos}) => {
    const truncateWords = (str, maxChars) => {
    if (!str) return "";
    return str.length <= maxChars ? str : str.slice(0, maxChars) + " ...";
  };
  const [playingIdx, setPlayingIdx] = useState(false)
  const {isDarkModeOn} = useDarkMode()
    return (
    <>
   <div className="flex flex-col gap-6 p-4 pt-8">
  {videos.map((video, idx) => (
    <div
      key={video._id || idx}
      className={`w-full border rounded-2xl shadow-md ${isDarkModeOn?"bg-slate-800":"bg-gray-200"} p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-200 hover:shadow-xl cursor-pointer`}
      onMouseEnter={() => setPlayingIdx(idx)}
      onMouseLeave={() => setPlayingIdx(null)}
    >
      {/* Thumbnail / Video Preview */}
      <div className="flex items-center justify-start w-full md:w-56 h-40 rounded-xl bg-gray-100 overflow-hidden">
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
            className="object-cover w-full h-full rounded-xl hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-gray-400">No Thumbnail</span>
        )}
      </div>

      {/* Video Info */}
      <div className="flex-1 flex flex-col justify-start items-start text-left">
        <h3 className={`text-lg md:text-2xl font-semibold ${isDarkModeOn?"text-purple-50":"text-purple-800"} mb-1`}>
          {truncateWords(video.title, 60)}
        </h3>
        <p className={`text-sm md:text-base ${isDarkModeOn?"text-gray-400":"text-gray-700"}  mb-2`}>
          {truncateWords(video.description, 150)}
        </p>
        <p className={`text-xs md:text-sm ${isDarkModeOn?"text-gray-300":"text-gray-500"} `}>
          {video.owner?.username}
        </p>

        <div className="flex gap-4 text-xs md:text-sm text-gray-400 mt-2">
          <p>{video.views || 0} views</p>
          <p>{new Date(video.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  ))}
</div>

    </>
  )
}

export default AccountVideos
