import React, { useState } from "react";

import "./updateProfilePopup.scss";
import styles from "./Account.module.scss";

function Themeselector() {
  const allThemmes = ["default", "christmas", "new year's eve"];
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
    document.documentElement.classList.add("theme-transition");
    document.body.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("activeTheme", theme);
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
      <form onSubmit={handleSubmit} className={styles.themeSelector}>
        <label>
          <b>Choose Theme:</b>
          <select
            {...bindtheme}
            value={localStorage.getItem("activeTheme")}
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
      </form>
    </>
  );
}
export default Themeselector;
