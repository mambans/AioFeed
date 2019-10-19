import React, { useState } from "react";

import "./updateProfilePopup.scss";
import styles from "./Account.module.scss";

function Themeselector() {
  const allThemmes = ["default", "christmas"];
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
  console.log(document.documentElement.getAttribute("data-theme"));

  const activateTheme = theme => {
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("activeTheme", theme);
    window.setTimeout(function() {
      document.documentElement.classList.remove("theme-transition");
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
          Choose Theme:
          <select {...bindtheme} value={localStorage.getItem("activeTheme")}>
            {allThemmes.map(theme => {
              return (
                <option value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
              );
            })}
          </select>
        </label>
      </form>
    </>
  );
}
export default Themeselector;
