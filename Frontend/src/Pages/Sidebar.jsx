import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillHome,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  MdAccountCircle,
  MdHistory,
  MdSettings,
} from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:block fixed w-60 h-screen top-0 left-0 z-40 bg-white shadow-md pt-20 px-4">
      <ul className="flex flex-col gap-3">
        <SidebarLink to="/" icon={<AiFillHome />} label="Home" />
        <SidebarLink to="/addvideo" icon={<AiOutlinePlus />} label="Add Video" />
        <SidebarLink to="/watch-history" icon={<MdHistory />} label="History" />
        <SidebarLink to="/settings" icon={<MdSettings />} label="Settings" />
        <SidebarLink to="/account" icon={<MdAccountCircle />} label="Account" />

        <li>
          <button
            onClick={() => navigate("/users/login")}
            className="w-full px-4 py-2 mt-4 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Login
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/users/register")}
            className="w-full px-4 py-2 mt-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Signup
          </button>
        </li>
      </ul>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center px-4 py-2 rounded-md text-purple-700 font-medium hover:bg-purple-100"
    >
      <span className="mr-2">{icon}</span> {label}
    </Link>
  </li>
);

export default Sidebar;
