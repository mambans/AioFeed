import React from "react";

import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useSyncedLocalState("activeTheme", {
    name: "default",
    type: "dark",
    startMonth: 0,
    startDate: 0,
    endMonth: 0,
    endDate: 0,
  });

  const themesArray = [
    { name: "default", type: "dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "neon", type: "dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    {
      name: "clean",
      type: "dark",
      default: true,
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    { name: "wood", type: "dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "stone", type: "dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "light", type: "light", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "simple dark", type: "dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "christmas", type: "dark", startMonth: 12, startDate: 1, endMonth: 12, endDate: 31 },
    { name: "new year's eve", type: "dark", startMonth: 1, startDate: 1, endMonth: 1, endDate: 1 },
  ];

  return (
    <ThemeContext.Provider
      value={{
        themesArray,
        activeTheme: activeTheme,
        setActiveContextTheme: setActiveTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
