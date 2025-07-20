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
  const [PassCode, setPassCode] = useState(null);
  const [email, setEmail] = useState(null);
  const [code, setcode] = useState(null);
  const [userEnteredCode, setUserEnteredCode] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [correctOtp, setCorrectOtp] = useState(false);
  const [forgetPasswordVisible, setForgetPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const varifyOTP = () => {
    if (userEnteredCode == code) {
      setCorrectOtp(true);
      toast.success("OTP verified", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } else {
      setCorrectOtp(false);
      toast.error("Incorrect OTP", {
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

  const changePassword = async (e) => {
    e.preventDefault()
    if(newPassword != confirmNewPassword){
     toast.warning("Passwords do not match", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
      return;
    }
    try {
      const res = await axios.patch(`${baseURL}/user/update-password`, {email, newPassword});
       toast.success("Password Changed", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } catch (error) {
       toast.error("Invalid changing password", {
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
    finally{
      setForgetPasswordVisible(false)
      setCorrectOtp(false)
      setIsCodeSent(false)
      navigate("/users/login")
    }
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
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "Invalid username / email or password",
        {
          position: "top-right",
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkModeOn ? "dark" : "light",
        }
      );
    }
  };

  const sendCode = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/users/forget-code`, email);
      setcode(res.data.data.code);
      console.log(res.data.code)
      setIsCodeSent(true);
      toast.success("OTP sent successfully", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkModeOn ? "dark" : "light",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending otp", {
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
          onClick={() => setForgetPasswordVisible(true)}
        >
          <p
            className={`${
              isDarkModeOn ? "text-purple-400" : "text-purple-600"
            } hover:underline`}
          >
            Forget password?
          </p>
        </p>
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

        {forgetPasswordVisible && (
          <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <form onSubmit={(e) => sendCode(e)} className="space-y-4">
                <label className="block text-gray-700 text-lg font-semibold">
                  Forget Password
                </label>
                <label htmlFor="Email">
                  E-mail:
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    id="email"
                    className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => setForgetPasswordVisible(false)}
                  >
                    Cancel
                  </button>

                  {/* <button
                        onClick={verifyOTP}
                        className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline  focus:outline-white focus:outline-offset-4 overflow-hidden"
                      >
                        <span className="relative z-20">Verify OTP</span>

                        <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>

                        <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
                        <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
                        <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
                        <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
                      </button> */}

                  <button
                    type="submit"
                    className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-white focus:outline-offset-4 overflow-hidden"
                  >
                    <span className="relative z-20">Send code</span>

                    <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>

                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isCodeSent && (
          <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <form onSubmit={() => varifyOTP()} className="space-y-4">
                <label className="block text-gray-700 text-lg font-semibold">
                  Verify OTP
                </label>
                <label htmlFor="otp">
                  Enter OTP:
                  <input
                    autoFocus
                    type="number"
                    onChange={(e) => setUserEnteredCode(e.target.value)}
                    value={userEnteredCode}
                    name="otp"
                    id="otp"
                    className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => setIsCodeSent(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-white focus:outline-offset-4 overflow-hidden"
                  >
                    <span className="relative z-20">Verify OTP</span>

                    <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>

                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
                    <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {correctOtp && (
           <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <form onSubmit={(e) => changePassword(e)} className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold">
                Update Password
              </label>
             
              <label htmlFor="newPassword">
                New Password:
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  name="newPassword"
                  id="newPassword"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label htmlFor="confirmNewPassword">
                Confirm New Password:
                <input
                  type="text"
                  name="confirmNewPassword"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  id="confirmNewPassword"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <div className="flex justify-end gap-4">
                
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Change password
                </button>
              </div>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Login;
