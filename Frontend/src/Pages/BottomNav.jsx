import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHome, AiOutlinePlus } from "react-icons/ai";
import { MdHistory, MdForum, MdSettings } from "react-icons/md";
import { useDarkMode } from "../DarkModeContext";
import { RiPlayList2Line } from "react-icons/ri";


const BottomNav = () => {
  const navigate = useNavigate();

  const { isDarkModeOn } = useDarkMode();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 h-16 flex md:hidden justify-around items-center 
    ${
      isDarkModeOn
        ? "bg-[#1F1F1F] text-[#F1F1F1] border-t border-[#2A2A2A]"
        : "bg-white text-[#1A1A1A] border-t border-[#E0E0E0]"
    }
    shadow-t`}
    >
      {" "}
      <BottomLink to="/" icon={<AiFillHome size={28} />} label="Home" />
      <BottomLink
        to="/playlist"
        icon={<RiPlayList2Line />}
        label="Playlists"
      />
      <button
        onClick={() => navigate("/addvideo")}
        className="mt-[-24px] w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
      >
        <AiOutlinePlus size={32} />
      </button>
      <BottomLink
        to="/hot-thoughts"
        icon={<MdForum size={28} />}
        label="Thoughts"
      />
      <BottomLink
        to="/settings"
        icon={<MdSettings size={28} />}
        label="Settings"
      />
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
