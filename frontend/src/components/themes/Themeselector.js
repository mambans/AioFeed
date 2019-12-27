import React, { useState } from "react";

import { ThemeSelector } from "./styledComponents";

function Themeselector() {
  const allThemmes = ["default", "original", "christmas", "new year's eve", "clean", "clean dark"];
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

  const activateTheme = theme => {
    console.log("TCL: Themeselector -> theme", theme);
    document.documentElement.classList.add("theme-transition");
    document.body.classList.add("theme-transition");
    localStorage.setItem("activeTheme", theme);

    if (theme === "default") {
      const currentMonth = new Date().getMonth();
      const currentDate = new Date().getDate();

      switch (currentMonth) {
        case 11:
          document.documentElement.setAttribute("data-theme", "christmas");
          break;
        case 0:
          if (currentDate <= 7) {
            document.documentElement.setAttribute("data-theme", "new year's eve");
          }
          break;
        default:
          document.documentElement.setAttribute("data-theme", "default");
      }
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
            {allThemmes.map(theme => {
              return (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
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
