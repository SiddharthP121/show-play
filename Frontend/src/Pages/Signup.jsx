import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import { ToastContainer, toast } from 'react-toastify';


const Signup = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const { isDarkModeOn } = useDarkMode();
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    avtar: null,
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
      const res = await axios.post(`${baseURL}/users/register`, data);
      localStorage.setItem("token", res.data.data.user);
      navigate("/");
       toast.success("Account Created Successfully", {
             position: "top-right",
             autoClose: 3500,
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: isDarkModeOn ? "dark" : "light",
           });
    } catch {
      setLoading(false);
       toast.error("Unable to create account", {
             position: "top-right",
             autoClose: 3500,
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: isDarkModeOn ? "dark" : "light",
           });
    }
  };

  const renderFileInput = (label, name, isRequired) => (
    <label className="flex flex-col items-start">
      <span
        className={`block text-sm font-medium mb-1 ${
          isDarkModeOn ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </span>

      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={handleChange}
        required={isRequired}
        className={`
          block w-full text-sm
          ${isDarkModeOn ? "text-gray-400" : "text-gray-600"}
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border file:border-gray-300
          ${
            isDarkModeOn
              ? "file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
              : "file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          }
          cursor-pointer
        `}
      />
      {form[name] && (
        <img
          src={URL.createObjectURL(form[name])}
          alt={`${label} preview`}
          className="mt-2 h-24 w-24 object-cover border rounded-lg"
        />
      )}
    </label>
  );

  return (
    <div
      className={`${
        isDarkModeOn
          ? "bg-gradient-to-br from-gray-700 to-gray-900"
          : "bg-gradient-to-br from-blue-100 to-purple-200"
      } select-none min-h-screen flex items-center justify-center px-4 py-8`}
    >
      <div
        className={`${
          isDarkModeOn ? "bg-gray-800" : "bg-white"
        } w-full max-w-xl rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 space-y-6 transition-colors duration-300`}
      >
        <h2
          className={`${
            isDarkModeOn ? "text-gray-100" : "text-purple-700"
          } text-2xl sm:text-3xl font-extrabold text-center`}
        >
          Get Started with Revo Multimedia
        </h2>
        <p
          className={`${
            isDarkModeOn ? "text-gray-400" : "text-gray-600"
          } text-center text-sm sm:text-base`}
        >
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Full Name", name: "fullname", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkModeOn ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {label}
                </label>
                <input
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                    ${
                      isDarkModeOn
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
                    }
                  `}
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {renderFileInput("Avatar", "avatar", true)}
            {renderFileInput("Cover Image (optional)", "coverImage", false)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors duration-200
              ${
                isDarkModeOn
                  ? "bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                  : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              }
            `}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  fill="currentColor"
                  className="opacity-75"
                />
              </svg>
            )}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          className={`text-center text-sm ${
            isDarkModeOn ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/users/login"
            className={`${
              isDarkModeOn ? "text-purple-400" : "text-purple-600"
            } hover:underline`}
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
