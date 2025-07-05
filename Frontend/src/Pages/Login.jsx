import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const navigate = useNavigate();
  const { isDarkModeOn } = useDarkMode();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
      const res = await axios.post(`${baseURL}/users/login`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("token", res.data.data.user);
      navigate("/");
      toast.success("Logged In Successfully", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } catch(error) {
      setLoading(false);
      toast.error(error.response.data.message || "Invalid username / email or password", {
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

  return (
    <div
      className={`select-none min-h-screen flex items-center justify-center px-4 py-8
      ${
        isDarkModeOn
          ? "bg-gradient-to-br from-gray-700 to-gray-900"
          : "bg-gradient-to-br from-blue-100 to-purple-200"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-lg p-8 space-y-6 transition-colors duration-300
        ${isDarkModeOn ? "bg-gray-800" : "bg-white"}`}
      >
        <h1
          className={`text-3xl font-extrabold text-center
          ${isDarkModeOn ? "text-gray-100" : "text-purple-700"}`}
        >
          Login to Revo Multimedia
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block text-sm font-medium mb-1
              ${isDarkModeOn ? "text-gray-300" : "text-gray-700"}`}
            >
              Username or Email
            </label>
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              required
              placeholder="Enter your username or email"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                ${
                  isDarkModeOn
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
                }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1
              ${isDarkModeOn ? "text-gray-300" : "text-gray-700"}`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                ${
                  isDarkModeOn
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:ring-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-400"
                }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors duration-200
              ${
                isDarkModeOn
                  ? "bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                  : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              }`}
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
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p
          className={`text-center text-sm
          ${isDarkModeOn ? "text-gray-400" : "text-gray-600"}`}
        >
          Don't have an account?{" "}
          <Link
            to="/users/register"
            className={`${
              isDarkModeOn ? "text-purple-400" : "text-purple-600"
            } hover:underline`}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
