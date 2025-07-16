import React from "react";
import { FaWhatsapp, FaInstagram, FaEnvelope, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useDarkMode } from "../DarkModeContext";

const LastFoot = () => {
  const { isDarkModeOn } = useDarkMode();

  return (
    <footer
      className={`w-full px-6 py-8 ${
        isDarkModeOn
          ? "bg-gray-900 text-gray-300"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-bold">Revoo Multimedia</h2>
          <p className="mt-2 text-base">
            Where creativity meets code — delivering visual brilliance and digital innovation.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-base">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Portfolio</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Social</h3>
          <div className="flex gap-4 text-2xl">
            <a href="https://wa.me/..." target="_blank" rel="noopener noreferrer" className="hover:text-green-500"><FaWhatsapp /></a>
            <a href="https://instagram.com/..." target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="https://x.com/..." target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTwitter /></a>
            <a href="https://linkedin.com/..." target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"><FaLinkedin /></a>
            <a href="mailto:..." className="hover:text-red-500"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm opacity-70">
        &copy; 2025 Revoo Multimedia. Designed with passion & built with Tailwind CSS.
      </div>
    </footer>
  );
};

export default LastFoot;
