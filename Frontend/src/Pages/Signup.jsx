import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_DEFAULT_URL;
  const token = localStorage.getItem("token");


  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    avtar: null,
    coverImage: null,
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((form) => ({
      ...form,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      const res = await axios.post(`${baseURL}/users/register`, formData, );
      setMessage(res.data.message || "User Registered Successfully");
      alert("user registered");
      console.log(res.data.data.user); // This will log the accessToken
      localStorage.setItem("token", res.data.data.user); // Save the accessToken
      console.log("Token being sent:", res.data.data.user); // Log the token being sent
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      alert("registration failed");
    }
  };

  return (
    <div className="select-none min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Enter full name"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter e-mail"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="avtar">
              Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              name="avtar"
              id="avtar"
              onChange={handleChange}
              required
              className="w-full text-sm"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="coverImage"
            >
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="coverImage"
              id="coverImage"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition cursor-pointer"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/users/login"
            className="text-purple-600 hover:underline text-sm"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
