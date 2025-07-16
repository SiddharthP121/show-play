import React from "react";
import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useDarkMode } from "../DarkModeContext";

const LastFoot = () => {
  const isDarkModeOn = useDarkMode();
  return (
    <div>
       <footer
      className={`w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t transition-colors duration-300 ${
        isDarkModeOn
          ? 'bg-gray-900 text-gray-300 border-gray-700'
          : 'bg-white text-gray-800 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide">
            Revoo Multimedia
          </h2>
          <p className="mt-2 text-sm lg:text-base leading-relaxed">
            Where creativity meets code — delivering visual brilliance and digital innovation.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md sm:text-lg font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-sm sm:text-base">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Portfolio</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-md sm:text-lg font-semibold mb-2">Social</h3>
          <div className="flex flex-wrap gap-4 text-xl sm:text-2xl">
            <a
              href="https://wa.me/918109013328?text=Hi%20Revoo%20Team%20👋"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/siddharth_wd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
              aria-label="Visit Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/siddharth_wd121"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
              aria-label="Visit X Profile"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/siddhartha-potphode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
              aria-label="Visit LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:siddharthpotphode7@gmail.com"
              className="hover:text-red-500"
              aria-label="Send Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm opacity-70">
        &copy; 2025 Revoo Multimedia. Designed with passion & built with Tailwind CSS.
      </div>
    </footer>

    </div>
  );
};

export default LastFoot;
