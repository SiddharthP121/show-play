import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import { AiFillHome, AiOutlinePlus } from "react-icons/ai";
import { MdAccountCircle, MdHistory, MdSettings } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isDarkModeOn } = useDarkMode();

  return (
    <aside
      className={`hidden md:block fixed w-60 h-screen top-0 left-0 z-40 
    ${
      isDarkModeOn
        ? "bg-[#141414] text-[#F1F1F1] border-r border-[#2A2A2A]"
        : "bg-[#F4F4F4] text-[#1A1A1A] border-r border-[#E0E0E0]"
    } 
    shadow-md pt-20 px-4`}
    >
      {" "}
      <ul className="flex flex-col gap-3">
        <SidebarLink to="/" icon={<AiFillHome />} label="Home" />
        <SidebarLink
          to="/addvideo"
          icon={<AiOutlinePlus />}
          label="Add Video"
        />
        <SidebarLink to="/watch-history" icon={<MdHistory />} label="History" />
        <SidebarLink to="/settings" icon={<MdSettings />} label="Settings" />
        <SidebarLink to="/account" icon={<MdAccountCircle />} label="Account" />
      </ul>
    </aside>
  );
};
const SidebarLink = ({ to, icon, label }) => {
  const { isDarkModeOn } = useDarkMode();

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
          isDarkModeOn
            ? "hover:bg-blue-800 text-white"
            : "hover:bg-purple-100 text-purple-700"
        }`}
      >
        <span className="mr-3 text-lg">{icon}</span> {label}
      </Link>
    </li>
  );
};

export default Sidebar;
