import { useState } from "react";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import {BrowserRouter, Routes, Route } from "react-router-dom"
import Add_video from "./Pages/Add-video";
import HotThoughts from "./Pages/HotThoughts";
import Account from "./Pages/Account";


function App() {
  const [count, setCount] = useState(0);

  return <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element= {<Home />} />
    <Route path="/users/register" element= {<Signup />} />
    <Route path="/users/login" element= {<Login />} />
    <Route path="/addvideo" element= {<Add_video />} />
    <Route path="/hot-thoughts" element= {<HotThoughts />} />
    <Route path="/account" element= {<Account />} />
  </Routes>
  </BrowserRouter>
  </>;
}

export default App;
