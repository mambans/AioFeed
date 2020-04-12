import React from "react";

import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useSyncedLocalState("activeTheme", "default");

  const themesArray = [
    { name: "default", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "original", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "christmas", startMonth: 12, startDate: 1, endMonth: 12, endDate: 31 },
    { name: "new year's eve", startMonth: 1, startDate: 1, endMonth: 1, endDate: 1 },
    { name: "light", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "clean", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "clean dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "simple dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
  ];

  return (
    <ThemeContext.Provider
      value={{
        themesArray,
        activeTheme: activeTheme,
        setActiveTheme: setActiveTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
