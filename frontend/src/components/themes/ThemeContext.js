import React from "react";

import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

const ThemeContext = React.createContext();

export const findSeasonOrDefaultTheme = (allThemes) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  const startTheme = allThemes.find((themes) => {
    return (
      themes.startMonth <= currentMonth &&
      themes.endMonth >= currentMonth &&
      themes.startDate <= currentDate &&
      themes.endDate >= currentDate
    );
  });

  const defaultTheme = allThemes.find((themes) => {
    return themes.default;
  });

  return startTheme || defaultTheme || {};
};

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
    {
      name: "default",
      type: "dark",
      image: findSeasonOrDefaultTheme,
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "matt blue",
      type: "dark",
      image: "matt_blue.png",
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "clean",
      type: "dark",
      image: "clean.png",
      default: true,
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "wood",
      type: "dark",
      image: "wood.webp",
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "stone",
      type: "dark",
      image: "stone.webp",
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "light",
      type: "light",
      backgroundColor: "white",
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "simple dark",
      type: "dark",
      backgroundColor: "black",
      startMonth: 0,
      startDate: 0,
      endMonth: 0,
      endDate: 0,
    },
    {
      name: "christmas",
      type: "dark",
      image: "christmas.webp",
      startMonth: 12,
      startDate: 1,
      endMonth: 12,
      endDate: 31,
    },
    {
      name: "new year's eve",
      type: "dark",
      image: "new_years_eve.webp",
      startMonth: 1,
      startDate: 1,
      endMonth: 1,
      endDate: 1,
    },
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
