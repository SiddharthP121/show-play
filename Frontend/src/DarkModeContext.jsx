import React, { createContext, useContext, useState } from "react";

const darkModeContext = createContext();

export const useDarkMode = () => useContext(darkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [isDarkModeOn, setIsDarkModeOn] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkModeOn((prev) => !prev);
    isDarkModeOn
    ? alert("Dark mode turned off!")
    : alert("Dark mode turned on!")
  };

  return (
    <darkModeContext.Provider value={{ isDarkModeOn, toggleDarkMode }}>
      {children}
    </darkModeContext.Provider>
  );
};
