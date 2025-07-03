import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const baseURL = import.meta.env.DEFAULT_URL;

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    try {
      let res = await axios.post(`${baseURL}/users/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message || "User logged in successfully");
      alert("logged in successfully");
      console.log(res.data.data.user); // This will log the accessToken
      localStorage.setItem("token", res.data.data.user); // Save the accessToken
      console.log("Token being sent:", res.data.data.user);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      alert("Login failed");
      console.log(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700 select-none cursor-default">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username or Email
            </label>
            <input
              type="text"
              onChange={handleChange}
              value={form.indentifier}
              name="identifier"
              id="identifier"
              placeholder="Enter your Username or E-mail"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/users/register"
            className="text-purple-600 hover:underline text-sm"
          >
            Do not have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
