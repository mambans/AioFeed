import { getLocalstorage } from "../../util/Utils";

export default async (themesArray) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  if (!getLocalstorage("activeTheme") || getLocalstorage("activeTheme").name === "default") {
    const startTheme = await themesArray.find((theme) => {
      return (
        theme.startMonth <= currentMonth &&
        theme.endMonth >= currentMonth &&
        theme.startDate <= currentDate &&
        theme.endDate >= currentDate
      );
    });

    const defaultTheme = themesArray.find((theme) => {
      return theme.default;
    });

    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute(
      "data-theme",
      startTheme ? startTheme.name : defaultTheme.name || "default"
    );
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
