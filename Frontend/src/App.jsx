import { useState } from "react";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Add_video from "./Pages/Add-video";
import HotThoughts from "./Pages/HotThoughts";
import VideoPlayer from "./Pages/VideoPlayer";
import Account from "./Pages/Account";
import WatchHistory from "./Pages/WatchHistory";
import Settings from "./Pages/Settings";
import { DarkModeProvider } from "./DarkModeContext";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
     <DarkModeProvider>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users/register" element={<Signup />} />
            <Route path="/users/login" element={<Login />} />
            <Route path="/addvideo" element={<Add_video />} />
            <Route path="/video/watch/:videoId" element={<VideoPlayer />} />
            <Route path="/hot-thoughts" element={<HotThoughts />} />
            <Route path="/account" element={<Account />} />
            <Route path="/watch-history" element={<WatchHistory />} />
            <Route path="/settings" element={<Settings />} />
            
          </Routes>
        </BrowserRouter>
     </DarkModeProvider>
      
    </>
  );
}

export default App;
