import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="my-3 px-4 py-2 border rounded-xl bg-transparent hover:text-gray-500 hover:shadow-md transition-all text-sm md:text-base w-full flex justify-center items-center"
  >
    {label}
  </button>
);

const AuthButton = ({
  label,
  route,
  borderColor,
  textColor,
  hoverColor,
  navigate,
}) => (
  <button
    onClick={() => navigate(route)}
    className={`w-full py-2 px-6 rounded-lg border ${borderColor} ${textColor} font-medium tracking-wide hover:shadow-lg hover:${hoverColor} transition-all duration-300`}
  >
    {label}
  </button>
);

const Settings = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [coverImageVisibile, setCoverImageVisibile] = useState(false);
  const [userDetailsVisible, setuserDetailsVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [userAvatar, setUserAvatar] = useState();
  const [newAvtar, setNewAvtar] = useState();
  const [CoverImage, setCoverImage] = useState();
  const [newCoverImage, setNewCoverImage] = useState();
  const [newPassoword, setNewPassoword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [user, setUser] = useState();
  const [userForm, setUserForm] = useState({
    username: "",
    fullname: "",
    email: "",
  });
  const token = localStorage.getItem("token");

  const fetchAvatar = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/users/profile",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserAvatar(data.data.user.avtar);
    } catch (err) {
      console.log(err?.response?.data?.message || "Failed to load avatar");
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/users/profile",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(data.data.user);
      setCoverImage(data.data.user.coverImage);
      console.log(data.data.user);
      setUserForm({
        username: data.data.user.username,
        fullname: data.data.user.fullname,
        email: data.data.user.email,
      });
    } catch (err) {
      console.log(err?.response?.data?.message || "Failed to load user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.log(err?.response?.data?.message);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!newAvtar) return;

    // handle avatar upload logic
    e.preventDefault();
    const formData = new FormData();
    formData.append("avtar", newAvtar);
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/v1/users/update-avtar",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserAvatar(res.data.data.user);
      alert("Avatar updated successfully");
      setAvatarVisible(false);
      // console.log(res.data.data.user)
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const handleCoverSubmit = async (e) => {
    e.preventDefault();
    if (!newCoverImage) return;
    const formData = new FormData();
    formData.append("coverImage", newCoverImage);
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/v1/users/update-coverimage",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoverImage(res.data.data.user);
      alert("Cover image change successfully");
      setCoverImageVisibile(false);
      console.log(res.data.data.user);
    } catch (error) {
      console.log(
        error?.response?.data?.message || "Unable to update the cover image"
      );
    }
  };

  const handleNewPassoword = async (e) => {
    e.preventDefault()
    if (confirmNewPassword !== newPassoword) {
      alert("Password do not match")
      return
    }

    if (oldPassword === newPassoword) {
      alert("Old and new passwords are same")
      return
    }
    try {
      const formData = new FormData();
      formData.append("oldPassword", oldPassword)
      formData.append("newPassword", newPassoword)
      const res = await axios.patch("http://localhost:8000/api/v1/users/change-password", formData, {
        withCredentials: true, 
        headers: {
          Authorization: `Bearer ${token}`
        }
      } )
      alert("Password changed successfully")
      changePasswordVisible(false)
    } catch (error) {
      if (error.response) {
        const {status, data} = error.response;
        const message = data?.message || "Somthing went wrong"
        console.error("Status Code: ", status)
        console.error("Message: ", message)
      alert("Message: ", message)
      }
      else{
        console.error("Unexpected Error: " ,error.message)
      }
    }
  }
  

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", userForm.username);
    formData.append("fullname", userForm.fullname);
    formData.append("email", userForm.email);
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/v1/users/update-account-details",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User details changed");
      setuserDetailsVisible(false);
    } catch (error) {
      console.log(
        error.response.data.message || "Unable to upload user details"
      );
      alert(
        error.response.data.message ||
          "Unable to upload user details at the moment"
      );
    }
  };

  const handleAvatarChange = (e) => {
    setNewAvtar(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    setNewCoverImage(e.target.files[0]);
  };

 

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm((form) => ({
      ...form,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen overflow-x-hidden select-none">
        <TopBar
          search={search}
          setSearch={setSearch}
          handleSearch={(e) => e.preventDefault()}
        />
        <Sidebar />

        <main className="pt-24 pb-24 px-4 md:px-8 md:ml-50 lg:px-16 bg-transparent">
          <div className="flex flex-col items-center gap-6">
            <div className="hidden md:block w-[15%]" />

            <div className="flex flex-col gap-1 w-full md:w-[60%]">
              <ActionButton
                label="Change Avatar"
                onClick={() => setAvatarVisible(true)}
              />
              <ActionButton
                label="Change Cover Image"
                onClick={() => setCoverImageVisibile(true)}
              />
              <ActionButton
                label="Update Account Details"
                onClick={() => setuserDetailsVisible(true)}
              />
              <ActionButton
                label="Change Password"
                onClick={() => setChangePasswordVisible(true)}
              />
              <ActionButton label="Verify Email" />
              <ActionButton label="Appearance" />

              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-6 rounded-lg border border-red-700 text-red-600 font-medium tracking-wide hover:shadow-md hover:text-red-700 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <ul className="space-y-4 flex justify-around">
                  <li>
                    <AuthButton
                      label="Login"
                      route="/users/login"
                      borderColor="border-purple-500"
                      textColor="text-purple-500"
                      hoverColor="text-purple-400"
                      navigate={navigate}
                    />
                  </li>
                  <li>
                    <AuthButton
                      label="Signup"
                      route="/users/register"
                      borderColor="border-blue-500"
                      textColor="text-blue-500"
                      hoverColor="text-blue-400"
                      navigate={navigate}
                    />
                  </li>
                </ul>
              )}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>

      {avatarVisible && (
        <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <form onSubmit={handleAvatarSubmit} className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold">
                Change Avatar
              </label>
              <label htmlFor="current Image">
                Current Avtar
                <img
                  src={userAvatar}
                  alt="Current Avatar"
                  className=" mt-3 mb-3 w-45 h-45 border border-t-black object-cover rounded-full"
                />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                name="avatar"
                id="avatar"
                className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setAvatarVisible(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {coverImageVisibile && (
        <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <form onSubmit={handleCoverSubmit} className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold">
                Change Cover Image
              </label>
              <label htmlFor="current Image">
                Current Cover Image
                <img
                  src={CoverImage}
                  alt="Cover Image"
                  className=" mt-3 mb-3 w-90 h-45 border border-t-black object-cover"
                />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                name="coverImage"
                id="coverImage"
                className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setCoverImageVisibile(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userDetailsVisible && (
        <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <form onSubmit={handleUserDetailsSubmit} className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold">
                Update Username, Fullname, Email
              </label>
              <label htmlFor="username">
                Username:
                <input
                  type="text"
                  onChange={handleUserChange}
                  name="username"
                  value={userForm.username}
                  id="username"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label htmlFor="fullname">
                Fullname:
                <input
                  type="text"
                  onChange={handleUserChange}
                  name="fullname"
                  id="fullname"
                  value={userForm.fullname}
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label htmlFor="email">
                Email:
                <input
                  type="email"
                  onChange={handleUserChange}
                  name="email"
                  value={userForm.email}
                  id="email"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setuserDetailsVisible(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {changePasswordVisible && (
        
        <div className="fixed inset-0 bg-blue-200/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <form onSubmit={handleNewPassoword} className="space-y-4">
              <label className="block text-gray-700 text-lg font-semibold">
                Update Password
              </label>
              <label htmlFor="oldPassword">
                Old Password:
                <input
                  type="text"
                  onChange={(e)=>setOldPassword(e.target.value)}
                  name="password"
                  id="passoword"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <label htmlFor="newPassword">
                New Password:
                <input
                  type="password"
                  onChange={(e)=>setNewPassoword(e.target.value)}
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
                  onChange={(e)=>setConfirmNewPassword(e.target.value)}
                  id="confirmNewPassword"
                  className="w-full border-none px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </label>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => (setChangePasswordVisible(false))}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      
      )}
    </>
  );
};

export default Settings;
