import { getLocalstorage } from "../../util/Utils";

import { findSeasonOrDefaultTheme } from "./ThemeContext";

export default async (themesArray) => {
  if (!getLocalstorage("activeTheme") || getLocalstorage("activeTheme").name === "default") {
    const activatingTheme = findSeasonOrDefaultTheme(themesArray);

    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", activatingTheme.name || "default");
    window.setTimeout(function () {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  } else {
    console.log("Theme:", getLocalstorage("activeTheme").name);
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", getLocalstorage("activeTheme").name);
    window.setTimeout(function () {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  }
};
