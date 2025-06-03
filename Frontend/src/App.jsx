import { useState } from "react";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import {BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
  const [count, setCount] = useState(0);

  return <>
  <BrowserRouter>
  <Routes>
    <Route path="/users/register" element= {<Signup />} />
    <Route path="users/login" element= {<Login />} />
    <Route path="/" element= {<Home />} />
  </Routes>
  </BrowserRouter>
  </>;
}

export default App;
