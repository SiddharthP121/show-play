import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the styles

const darkModeContext = createContext();

export const useDarkMode = () => useContext(darkModeContext);

export const DarkModeProvider = ({ children }) => {
    const [isDarkModeOn, setIsDarkModeOn] = useState(() => {
    const stored = localStorage.getItem("isDarkModeOn");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem("isDarkModeOn", JSON.stringify(isDarkModeOn));
  }, [isDarkModeOn]);

  const toggleDarkMode = () => {
    setIsDarkModeOn((prev) => {
      const newMode = !prev;
      toast.success(newMode ? "🌙 Dark mode turned on!" : "☀️ Dark mode turned off!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: newMode ? "dark" : "light",
      });
      return newMode;
    });
  };

  return (
    <darkModeContext.Provider value={{ isDarkModeOn, toggleDarkMode }}>
      {children}
      <ToastContainer />
    </darkModeContext.Provider>
  );
};