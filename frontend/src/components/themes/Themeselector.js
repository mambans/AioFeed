import React, { useContext } from "react";

import { ThemeSelector } from "./styledComponents";
import ThemeContext from "./ThemeContext";
import useSyncedLocalState from "./../../hooks/useSyncedLocalState";

export default () => {
  const { themesArray } = useContext(ThemeContext);
  const [activeTheme, setActiveTheme] = useSyncedLocalState("activeTheme", '"default"');

  const activateTheme = (theme) => {
    document.documentElement.classList.add("theme-transition");
    document.body.classList.add("theme-transition");

    if (theme === "default") {
      const currentMonth = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();

      const startTheme = themesArray.find((theme) => {
        return (
          theme.startMonth <= currentMonth &&
          theme.endMonth >= currentMonth &&
          theme.startDate <= currentDate &&
          theme.endDate >= currentDate
        );
      });
      document.documentElement.setAttribute(
        "data-theme",
        startTheme ? startTheme.name : themesArray[1].name
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme);
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
          <select defaultValue={activeTheme} className='custom-select custom-select-sm'>
            {themesArray.map((theme) => {
              return (
                <option
                  key={theme.name}
                  value={theme.name}
                  onClick={() => {
                    setActiveTheme(() => {
                      return theme.name;
                    });
                    activateTheme(theme.name);
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
