import React from 'react'
import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useDarkMode } from '../DarkModeContext';


const LastFoot = () => {
    const isDarkModeOn = useDarkMode()
  return (
    <div>
        <footer
      className={`w-full px-6 py-8 border-t transition-colors duration-300 ${
        isDarkModeOn
          ? 'bg-gray-900 text-gray-300 border-gray-700'
          : 'bg-white text-gray-800 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-xl font-bold tracking-wide">Revoo Multimedia</h2>
          <p className="mt-2 text-sm">
            Where creativity meets code — delivering visual brilliance and digital innovation.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Portfolio</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Social</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
              <FaWhatsapp />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs opacity-70">
        &copy; 2025 Revoo Multimedia. Designed with passion & built with Tailwind CSS.
      </div>
    </footer>

    </div>
  )
}

export default LastFoot
