import React, { useContext } from "react";

import { ThemeSelector } from "./styledComponents";
import ThemeContext from "./ThemeContext";
import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

export default () => {
  const { themesArray, setActiveContextTheme } = useContext(ThemeContext);
  const [activeTheme, setActiveTheme] = useSyncedLocalState("activeTheme", {
    name: "default",
    type: "dark",
    startMonth: 0,
    startDate: 0,
    endMonth: 0,
    endDate: 0,
  });

  const activateTheme = (theme) => {
    document.documentElement.classList.add("theme-transition");
    document.body.classList.add("theme-transition");

    if (theme.name === "default") {
      const currentMonth = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();

      const startTheme = themesArray.find((themes) => {
        return (
          themes.startMonth <= currentMonth &&
          themes.endMonth >= currentMonth &&
          themes.startDate <= currentDate &&
          themes.endDate >= currentDate
        );
      });

      document.documentElement.setAttribute(
        "data-theme",
        startTheme
          ? startTheme.name
          : themesArray.find((themes) => {
              return themes.default;
            }).name
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme.name);
    }
    window.setTimeout(function () {
      document.documentElement.classList.remove("theme-transition");
      document.body.classList.remove("theme-transition");
    }, 1000);
  };

  return (
    <>
      <ThemeSelector>
        <label>
          <b>Choose Theme:</b>
          <select defaultValue={activeTheme.name} className='custom-select custom-select-sm'>
            {themesArray.map((theme) => {
              return (
                <option
                  key={theme.name}
                  value={theme.name}
                  onClick={() => {
                    setActiveTheme(theme);
                    activateTheme(theme);
                    if (theme.type !== activeTheme.type) setActiveContextTheme(theme);
                  }}>
                  {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                </option>
              );
            })}
          </select>
        </label>
      </ThemeSelector>
    </>
  );
};
