import React, { useState, useContext } from "react";

import { ThemeSelector } from "./styledComponents";
import ThemeContext from "./ThemeContext";

function Themeselector() {
  const { themesArray } = useContext(ThemeContext);

  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
          activateTheme(event.target.value);
        },
      },
    };
  };

  const { value: theme, bind: bindtheme } = useInput("");

  const activateTheme = async theme => {
    document.documentElement.classList.add("theme-transition");
    document.body.classList.add("theme-transition");
    localStorage.setItem("activeTheme", theme);

    if (theme === "default") {
      const currentMonth = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();

      const startTheme = await themesArray.find(theme => {
        return (
          theme.startMonth <= currentMonth &&
          theme.endMonth >= currentMonth &&
          theme.startDate <= currentDate &&
          theme.endDate >= currentDate
        );
      });

      console.log("Theme:", startTheme ? startTheme.name : themesArray[1].name);
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute(
        "data-theme",
        startTheme ? startTheme.name : themesArray[1].name
      );
      window.setTimeout(function() {
        document.documentElement.classList.remove("theme-transition");
      }, 1000);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    window.setTimeout(function() {
      document.documentElement.classList.remove("theme-transition");
      document.body.classList.remove("theme-transition");
    }, 1000);
  };

  const handleSubmit = event => {
    event.preventDefault();
    activateTheme(theme);
  };

  return (
    <>
      <ThemeSelector onSubmit={handleSubmit}>
        <label>
          <b>Choose Theme:</b>
          <select
            {...bindtheme}
            value={localStorage.getItem("activeTheme") || "default"}
            className='custom-select custom-select-sm'>
            {themesArray.map(theme => {
              return (
                <option key={theme.name} value={theme.name}>
                  {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                </option>
              );
            })}
          </select>
        </label>
      </ThemeSelector>
    </>
  );
}
export default Themeselector;
