import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillHome,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  MdHistory,
  MdForum,
  MdSettings,
} from "react-icons/md";

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-t h-16 flex md:hidden justify-around items-center">
      <BottomLink to="/" icon={<AiFillHome size={28} />} label="Home" />
      <BottomLink to="/watch-history" icon={<MdHistory size={28} />} label="History" />

      <button
        onClick={() => navigate("/addvideo")}
        className="mt-[-24px] w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
      >
        <AiOutlinePlus size={32} />
      </button>

      <BottomLink to="/hot-thoughts" icon={<MdForum size={28} />} label="Tweets" />
      <BottomLink to="/settings" icon={<MdSettings size={28} />} label="Settings" />
    </nav>
  );
};

const BottomLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex-1 flex flex-col items-center justify-center text-gray-500 font-medium py-2 text-xs"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default BottomNav;
