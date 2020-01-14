import React from "react";

import ThemeContext from "./ThemeContext";

export default ({ children }) => {
  const themesArray = [
    { name: "default", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "original", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "christmas", startMonth: 12, startDate: 1, endMonth: 12, endDate: 31 },
    { name: "new year's eve", startMonth: 1, startDate: 1, endMonth: 1, endDate: 1 },
    { name: "clean", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
    { name: "clean dark", startMonth: 0, startDate: 0, endMonth: 0, endDate: 0 },
  ];

  return (
    <ThemeContext.Provider
      value={{
        themesArray,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
